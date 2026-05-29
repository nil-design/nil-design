import {
    buildAuthUrl as buildOpenRouterAuthUrl,
    clearPendingAuth as clearOpenRouterPendingAuth,
    completeAuthCallback as completeOpenRouterAuthCallback,
    removeAuthParams as removeOpenRouterAuthParams,
} from './auth';
import { createChatStream } from './chat';

export const createOpenRouterService = ({ fetcher } = {}) => ({
    buildAuthUrl(options) {
        return buildOpenRouterAuthUrl(options);
    },

    completeAuthCallback(options = {}) {
        return completeOpenRouterAuthCallback({ fetcher, ...options });
    },

    createChatStream(options = {}) {
        return createChatStream({ fetcher, ...options });
    },

    removeAuthParams() {
        removeOpenRouterAuthParams();
    },

    clearPendingAuth(storage) {
        clearOpenRouterPendingAuth(storage);
    },
});

export { DEFAULT_MODEL_ID } from './config';
export {
    AUTH_STATE_KEY,
    CODE_VERIFIER_KEY,
    buildAuthUrl,
    clearPendingAuth,
    completeAuthCallback,
    createPkceChallenge,
    createPkceVerifier,
    readPendingAuth,
    removeAuthParams,
} from './auth';
export { DEFAULT_SYSTEM_PROMPT, composeChatRequestMessages, createChatStream, parseChatStream } from './chat';
export { STORAGE_KEY, clearSession, createEmptySession, loadSession, saveSession } from './session';
