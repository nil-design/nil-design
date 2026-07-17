// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { bench, describe } from 'vitest';
import useEventListener from '../index';

describe('useEventListener', () => {
    bench('binds, dispatches, and removes an event listener', () => {
        const $target = document.createElement('button');
        const { unmount } = renderHook(() => useEventListener($target, 'click', () => {}));

        act(() => $target.dispatchEvent(new MouseEvent('click')));
        unmount();
    });
});
