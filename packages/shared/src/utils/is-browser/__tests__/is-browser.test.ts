// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';

const importIsBrowser = async () => (await import('../index')).default;

describe('isBrowser', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.resetModules();
    });

    it('should return false when window is unavailable', async () => {
        const isBrowser = await importIsBrowser();

        expect(isBrowser()).toBe(false);
    });

    it('should return true when running in browser-like environment', async () => {
        vi.stubGlobal('window', {
            document: {
                createElement: vi.fn(),
            },
        });

        const isBrowser = await importIsBrowser();

        expect(isBrowser()).toBe(true);
    });
});
