// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { bench, describe } from 'vitest';
import useIsomorphicLayoutEffect from '../index';

describe('useIsomorphicLayoutEffect', () => {
    bench('mounts and cleans up a layout effect', () => {
        const { unmount } = renderHook(() => useIsomorphicLayoutEffect(() => () => {}));

        unmount();
    });
});
