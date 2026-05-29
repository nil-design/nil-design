import { describe, expect, it } from 'vitest';
import { DEFAULT_MODEL_ID } from '../services/openrouter/config.js';
import { STORAGE_KEY, clearSession, loadSession, saveSession } from '../services/openrouter/session.js';

const createMemoryStorage = () => {
    const values = new Map();

    return {
        getItem: key => values.get(key) ?? null,
        removeItem: key => values.delete(key),
        setItem: (key, value) => values.set(key, value),
    };
};

describe('openrouter storage', () => {
    it('stores non-remembered sessions in sessionStorage', () => {
        const localStorage = createMemoryStorage();
        const sessionStorage = createMemoryStorage();

        saveSession(
            {
                key: 'sk-session',
                model: 'openrouter/free',
                remember: false,
            },
            { localStorage, sessionStorage },
        );

        expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
        expect(JSON.parse(sessionStorage.getItem(STORAGE_KEY))).toMatchObject({
            key: 'sk-session',
            remember: false,
        });
        expect(loadSession({ localStorage, sessionStorage }).key).toBe('sk-session');
    });

    it('migrates remembered sessions into localStorage', () => {
        const localStorage = createMemoryStorage();
        const sessionStorage = createMemoryStorage();

        saveSession({ key: 'sk-session', remember: false }, { localStorage, sessionStorage });
        saveSession({ key: 'sk-local', model: 'model/free', remember: true }, { localStorage, sessionStorage });

        expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
        expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toMatchObject({
            key: 'sk-local',
            model: 'model/free',
            remember: true,
        });
        expect(loadSession({ localStorage, sessionStorage }).remember).toBe(true);
    });

    it('clears both storage targets', () => {
        const localStorage = createMemoryStorage();
        const sessionStorage = createMemoryStorage();

        saveSession({ key: 'sk-local', remember: true }, { localStorage, sessionStorage });
        saveSession({ key: 'sk-session', remember: false }, { localStorage, sessionStorage });
        clearSession({ localStorage, sessionStorage });

        expect(loadSession({ localStorage, sessionStorage })).toEqual({
            key: '',
            model: DEFAULT_MODEL_ID,
            remember: false,
        });
    });
});
