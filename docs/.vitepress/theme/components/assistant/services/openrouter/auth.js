import { OPENROUTER_AUTH_URL, OPENROUTER_KEY_URL } from './config';

/* global globalThis */

const CODE_VERIFIER_KEY = 'nild:assistant:openrouter:code-verifier';
const AUTH_STATE_KEY = 'nild:assistant:openrouter:state';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
const VERIFIER_LENGTH = 64;

const bytesToBase64Url = bytes => {
    let value = '';

    for (const byte of bytes) {
        value += String.fromCharCode(byte);
    }

    return btoa(value).replace(/\+/gu, '-').replace(/\//gu, '_').replace(/=+$/u, '');
};

const getCrypto = () => (typeof window === 'undefined' ? globalThis.crypto : window.crypto);

export const createPkceVerifier = (length = VERIFIER_LENGTH, cryptoObject = getCrypto()) => {
    const bytes = new Uint8Array(length);

    cryptoObject.getRandomValues(bytes);

    return Array.from(bytes, byte => ALPHABET[byte % ALPHABET.length]).join('');
};

export const createPkceChallenge = async (verifier, cryptoObject = getCrypto()) => {
    const bytes = new TextEncoder().encode(verifier);
    const digest = await cryptoObject.subtle.digest('SHA-256', bytes);

    return bytesToBase64Url(new Uint8Array(digest));
};

const getCallbackUrl = () => `${window.location.origin}${window.location.pathname}`;

const savePendingAuth = ({ verifier, state }, storage = window.sessionStorage) => {
    storage.setItem(CODE_VERIFIER_KEY, verifier);
    storage.setItem(AUTH_STATE_KEY, state);
};

export const readPendingAuth = (storage = window.sessionStorage) => {
    return {
        verifier: storage.getItem(CODE_VERIFIER_KEY) || '',
        state: storage.getItem(AUTH_STATE_KEY) || '',
    };
};

export const clearPendingAuth = (storage = window.sessionStorage) => {
    storage.removeItem(CODE_VERIFIER_KEY);
    storage.removeItem(AUTH_STATE_KEY);
};

export const buildAuthUrl = async ({ callbackUrl = getCallbackUrl(), storage = window.sessionStorage } = {}) => {
    const verifier = createPkceVerifier();
    const state = createPkceVerifier(32);
    const challenge = await createPkceChallenge(verifier);
    const url = new URL(OPENROUTER_AUTH_URL);

    savePendingAuth({ verifier, state }, storage);

    url.searchParams.set('callback_url', callbackUrl);
    url.searchParams.set('code_challenge', challenge);
    url.searchParams.set('code_challenge_method', 'S256');
    url.searchParams.set('state', state);

    return url.toString();
};

export const readCallbackParams = (search = window.location.search) => {
    const params = new URLSearchParams(search);

    return {
        code: params.get('code') || '',
        state: params.get('state') || '',
    };
};

export const removeAuthParams = () => {
    const url = new URL(window.location.href);

    url.searchParams.delete('code');
    url.searchParams.delete('state');

    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
};

const readResponsePayload = async response => {
    if (typeof response.text !== 'function') {
        return typeof response.json === 'function' ? response.json() : {};
    }

    const text = await response.text();

    if (!text) {
        return {};
    }

    try {
        return JSON.parse(text);
    } catch {
        return { message: text };
    }
};

const getPayloadKey = payload => {
    return payload?.key || payload?.api_key || payload?.apiKey || payload?.data?.key || payload?.data?.api_key;
};

const postCodeExchange = ({ url, code, verifier, fetcher }) => {
    return fetcher(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            code,
            code_verifier: verifier,
            code_challenge_method: 'S256',
        }),
    });
};

export const exchangeAuthCode = async ({ code, verifier, fetcher = fetch } = {}) => {
    const response = await postCodeExchange({ url: OPENROUTER_KEY_URL, code, verifier, fetcher });
    const payload = await readResponsePayload(response);

    if (!response.ok) {
        throw new Error(
            payload?.error?.message ||
                payload?.message ||
                `OpenRouter authorization failed with status ${response.status}.`,
        );
    }

    const key = getPayloadKey(payload);

    if (!key) {
        throw new Error('OpenRouter authorization did not return an API key.');
    }

    return key;
};

export const completeAuthCallback = async ({
    search = window.location.search,
    storage = window.sessionStorage,
    fetcher = fetch,
} = {}) => {
    const { code, state } = readCallbackParams(search);

    if (!code) {
        return null;
    }

    const pending = readPendingAuth(storage);

    if (!pending.verifier) {
        throw new Error('OpenRouter authorization state is missing. Please connect again.');
    }
    if (pending.state && state && pending.state !== state) {
        throw new Error('OpenRouter authorization state does not match. Please connect again.');
    }

    // The verifier is short-lived and stays in sessionStorage until the OAuth code exchange finishes.
    const key = await exchangeAuthCode({ code, verifier: pending.verifier, fetcher });

    clearPendingAuth(storage);

    return key;
};

export { AUTH_STATE_KEY, CODE_VERIFIER_KEY };
