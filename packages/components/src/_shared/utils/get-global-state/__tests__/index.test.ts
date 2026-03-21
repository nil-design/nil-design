import { afterEach, describe, expect, it, vi } from 'vitest';

const TEST_STATE_KEY = '@nild/components/test-global-state';
const OTHER_TEST_STATE_KEY = '@nild/components/test-global-state-other';

const resetGlobalState = (...keys: string[]) => {
    vi.resetModules();

    keys.forEach(key => {
        delete (globalThis as typeof globalThis & Record<symbol, unknown>)[Symbol.for(key)];
    });
};

describe('getGlobalState', () => {
    afterEach(() => {
        resetGlobalState(TEST_STATE_KEY, OTHER_TEST_STATE_KEY);
    });

    it('reuses the same state for the same key', async () => {
        const { default: getGlobalState } = await import('..');
        const firstState = getGlobalState(TEST_STATE_KEY, () => ({ count: 1 }));
        const secondState = getGlobalState(TEST_STATE_KEY, () => ({ count: 2 }));

        expect(secondState).toBe(firstState);
        expect(secondState).toEqual({ count: 1 });
    });

    it('creates isolated state buckets for different keys', async () => {
        const { default: getGlobalState } = await import('..');
        const firstState = getGlobalState(TEST_STATE_KEY, () => ({ label: 'first' }));
        const secondState = getGlobalState(OTHER_TEST_STATE_KEY, () => ({ label: 'second' }));

        expect(secondState).not.toBe(firstState);
        expect(secondState).toEqual({ label: 'second' });
    });

    it('preserves state across module reloads', async () => {
        const { default: getGlobalState } = await import('..');
        const firstState = getGlobalState(TEST_STATE_KEY, () => ({ count: 1 }));

        vi.resetModules();

        const { default: getGlobalStateFromReloadedModule } = await import('..');
        const secondState = getGlobalStateFromReloadedModule(TEST_STATE_KEY, () => ({ count: 2 }));

        expect(secondState).toBe(firstState);
        expect(secondState).toEqual({ count: 1 });
    });
});
