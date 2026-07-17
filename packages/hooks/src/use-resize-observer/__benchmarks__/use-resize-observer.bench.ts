// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { bench, describe } from 'vitest';
import useResizeObserver from '../index';

describe('useResizeObserver', () => {
    bench('binds, dispatches, and removes a resize observer fallback', () => {
        const $target = document.createElement('div');
        const { unmount } = renderHook(() => useResizeObserver([$target], () => {}));

        act(() => window.dispatchEvent(new Event('resize')));
        unmount();
    });
});
