import { describe, expect, it, vi } from 'vitest';
import {
    AUTH_STATE_KEY,
    CODE_VERIFIER_KEY,
    buildAuthUrl,
    clearPendingAuth,
    completeAuthCallback,
    createPkceChallenge,
    createPkceVerifier,
    readPendingAuth,
} from '../services/openrouter/auth.js';

const createMemoryStorage = () => {
    const values = new Map();

    return {
        getItem: key => values.get(key) ?? null,
        removeItem: key => values.delete(key),
        setItem: (key, value) => values.set(key, value),
    };
};

describe('openrouter pkce', () => {
    it('generates verifier strings with the PKCE-safe alphabet', () => {
        const verifier = createPkceVerifier(64);

        expect(verifier).toHaveLength(64);
        expect(verifier).toMatch(/^[A-Za-z0-9._~-]+$/u);
    });

    it('builds a base64url SHA-256 code challenge', async () => {
        await expect(createPkceChallenge('verifier')).resolves.toBe('iMnq5o6zALKXGivsnlom_0F5_WYda32GHkxlV7mq7hQ');
    });

    it('stores verifier and state before returning the authorization URL', async () => {
        const storage = createMemoryStorage();
        const url = new URL(await buildAuthUrl({ callbackUrl: 'http://localhost:3000/zh-CN/', storage }));

        expect(url.origin).toBe('https://openrouter.ai');
        expect(url.pathname).toBe('/auth');
        expect(url.searchParams.get('callback_url')).toBe('http://localhost:3000/zh-CN/');
        expect(url.searchParams.get('code_challenge_method')).toBe('S256');
        expect(storage.getItem(CODE_VERIFIER_KEY)).toBeTruthy();
        expect(storage.getItem(AUTH_STATE_KEY)).toBeTruthy();
    });

    it('exchanges callback code and clears pending state', async () => {
        const storage = createMemoryStorage();

        storage.setItem(CODE_VERIFIER_KEY, 'verifier');
        storage.setItem(AUTH_STATE_KEY, 'state');

        const fetcher = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ key: 'sk-or-test' }),
        });

        await expect(
            completeAuthCallback({
                search: '?code=code&state=state',
                storage,
                fetcher,
            }),
        ).resolves.toBe('sk-or-test');

        expect(fetcher).toHaveBeenCalledWith(
            'https://openrouter.ai/api/v1/auth/keys',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({
                    code: 'code',
                    code_verifier: 'verifier',
                    code_challenge_method: 'S256',
                }),
            }),
        );
        expect(readPendingAuth(storage)).toEqual({ verifier: '', state: '' });
    });

    it('clears pending state explicitly', () => {
        const storage = createMemoryStorage();

        storage.setItem(CODE_VERIFIER_KEY, 'verifier');
        storage.setItem(AUTH_STATE_KEY, 'state');

        clearPendingAuth(storage);

        expect(readPendingAuth(storage)).toEqual({ verifier: '', state: '' });
    });
});
