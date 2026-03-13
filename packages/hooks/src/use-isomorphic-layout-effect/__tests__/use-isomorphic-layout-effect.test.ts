import { afterEach, describe, expect, it, vi } from 'vitest';

describe('useIsomorphicLayoutEffect', () => {
    afterEach(() => {
        vi.doUnmock('@nild/shared');
        vi.resetModules();
    });

    it('should use useLayoutEffect when isBrowser returns true', async () => {
        vi.doMock('@nild/shared', () => ({
            isBrowser: () => true,
        }));

        const [{ default: useIsomorphicLayoutEffect }, react] = await Promise.all([
            import('../index'),
            import('react'),
        ]);

        expect(useIsomorphicLayoutEffect).toBe(react.useLayoutEffect);
    });

    it('should use useEffect when isBrowser returns false', async () => {
        vi.doMock('@nild/shared', () => ({
            isBrowser: () => false,
        }));

        const [{ default: useIsomorphicLayoutEffect }, react] = await Promise.all([
            import('../index'),
            import('react'),
        ]);

        expect(useIsomorphicLayoutEffect).toBe(react.useEffect);
    });
});
