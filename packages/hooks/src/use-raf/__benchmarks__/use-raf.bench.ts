// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { bench, describe } from 'vitest';
import useRaf from '../index';

describe('useRaf', () => {
    bench('schedules and cancels an animation frame', () => {
        const { result, unmount } = renderHook(() => useRaf(() => {}));

        act(() => {
            result.current.run();
            result.current.cancel();
        });
        unmount();
    });
});
