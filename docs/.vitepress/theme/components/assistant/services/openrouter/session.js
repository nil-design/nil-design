import { DEFAULT_MODEL_ID } from './config';

const STORAGE_KEY = 'nild:assistant:openrouter';

const safeParse = value => {
    if (!value) {
        return null;
    }

    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
};

const getStoredSession = storage => safeParse(storage?.getItem(STORAGE_KEY));

export const createEmptySession = () => ({
    key: '',
    model: DEFAULT_MODEL_ID,
    remember: false,
});

export const loadSession = ({ localStorage = window.localStorage, sessionStorage = window.sessionStorage } = {}) => {
    const persistent = getStoredSession(localStorage);
    const session = getStoredSession(sessionStorage);

    if (persistent?.key || persistent?.remember) {
        return {
            ...createEmptySession(),
            ...persistent,
            remember: true,
        };
    }

    return {
        ...createEmptySession(),
        ...session,
        remember: false,
    };
};

export const saveSession = (
    session,
    { localStorage = window.localStorage, sessionStorage = window.sessionStorage } = {},
) => {
    const nextSession = {
        ...createEmptySession(),
        ...session,
    };
    const target = nextSession.remember ? localStorage : sessionStorage;
    const staleTarget = nextSession.remember ? sessionStorage : localStorage;

    // By default the user key is session-only; opting into remember migrates it to localStorage.
    staleTarget?.removeItem(STORAGE_KEY);
    target?.setItem(STORAGE_KEY, JSON.stringify(nextSession));

    return nextSession;
};

export const clearSession = ({ localStorage = window.localStorage, sessionStorage = window.sessionStorage } = {}) => {
    localStorage?.removeItem(STORAGE_KEY);
    sessionStorage?.removeItem(STORAGE_KEY);
};

export { STORAGE_KEY };
