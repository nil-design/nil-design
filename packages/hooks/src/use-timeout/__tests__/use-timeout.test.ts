import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useTimeout from '../index';

describe('useTimeout', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should run callback after the configured delay', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useTimeout(callback, 100));

        act(() => {
            result.current.run();
            vi.advanceTimersByTime(99);
        });
        expect(callback).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should cancel pending timeout when run is called again', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useTimeout(callback, 100));

        act(() => {
            result.current.run();
            vi.advanceTimersByTime(50);
            result.current.run(100);
            vi.advanceTimersByTime(50);
        });
        expect(callback).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(50);
        });
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should call the latest callback', () => {
        const firstCallback = vi.fn();
        const secondCallback = vi.fn();
        const { rerender, result } = renderHook(({ callback }) => useTimeout(callback, 100), {
            initialProps: { callback: firstCallback },
        });

        act(() => {
            result.current.run();
        });
        rerender({ callback: secondCallback });
        act(() => {
            vi.advanceTimersByTime(100);
        });

        expect(firstCallback).not.toHaveBeenCalled();
        expect(secondCallback).toHaveBeenCalledTimes(1);
    });

    it('should cancel pending timeout on unmount', () => {
        const callback = vi.fn();
        const { result, unmount } = renderHook(() => useTimeout(callback, 100));

        act(() => {
            result.current.run();
        });
        unmount();
        act(() => {
            vi.advanceTimersByTime(100);
        });

        expect(callback).not.toHaveBeenCalled();
    });
});
