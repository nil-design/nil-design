import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useRaf from '../index';

describe('useRaf', () => {
    let frameId = 0;
    let callbacks: Map<number, FrameRequestCallback>;

    beforeEach(() => {
        callbacks = new Map();
        frameId = 0;

        vi.stubGlobal(
            'requestAnimationFrame',
            vi.fn((callback: FrameRequestCallback) => {
                frameId += 1;
                callbacks.set(frameId, callback);

                return frameId;
            }),
        );
        vi.stubGlobal(
            'cancelAnimationFrame',
            vi.fn((id: number) => {
                callbacks.delete(id);
            }),
        );
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should run callback on the next animation frame', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useRaf(callback));

        act(() => {
            result.current.run();
            callbacks.get(1)?.(16);
        });

        expect(callback).toHaveBeenCalledWith(16);
    });

    it('should cancel previous frame when run is called again', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useRaf(callback));

        act(() => {
            result.current.run();
            result.current.run();
        });

        expect(callbacks.has(1)).toBe(false);
        expect(callbacks.has(2)).toBe(true);
    });

    it('should call the latest callback', () => {
        const firstCallback = vi.fn();
        const secondCallback = vi.fn();
        const { rerender, result } = renderHook(({ callback }) => useRaf(callback), {
            initialProps: { callback: firstCallback },
        });

        act(() => {
            result.current.run();
        });
        rerender({ callback: secondCallback });
        act(() => {
            callbacks.get(1)?.(16);
        });

        expect(firstCallback).not.toHaveBeenCalled();
        expect(secondCallback).toHaveBeenCalledWith(16);
    });

    it('should cancel pending frame on unmount', () => {
        const callback = vi.fn();
        const { result, unmount } = renderHook(() => useRaf(callback));

        act(() => {
            result.current.run();
        });
        unmount();

        expect(callbacks.size).toBe(0);
    });
});
