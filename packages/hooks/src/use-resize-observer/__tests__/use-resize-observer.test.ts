// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useResizeObserver from '../index';

class ResizeObserverMock {
    static instances: ResizeObserverMock[] = [];

    observe = vi.fn();
    disconnect = vi.fn();

    constructor(public callback: ResizeObserverCallback) {
        ResizeObserverMock.instances.push(this);
    }
}

describe('useResizeObserver', () => {
    beforeEach(() => {
        ResizeObserverMock.instances = [];
        vi.stubGlobal('ResizeObserver', ResizeObserverMock);
        Object.defineProperty(window, 'ResizeObserver', {
            configurable: true,
            writable: true,
            value: ResizeObserverMock,
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        Object.defineProperty(window, 'ResizeObserver', {
            configurable: true,
            writable: true,
            value: undefined,
        });
    });

    it('should observe a ref target and disconnect on unmount', () => {
        const $target = document.createElement('div');
        const targetRef = { current: $target };
        const { unmount } = renderHook(() => useResizeObserver([targetRef], vi.fn()));
        const observer = ResizeObserverMock.instances[0];

        expect(observer.observe).toHaveBeenCalledWith($target, {});

        unmount();

        expect(observer.disconnect).toHaveBeenCalledTimes(1);
    });

    it('should observe multiple targets once', () => {
        const $first = document.createElement('div');
        const $second = document.createElement('div');

        renderHook(() => useResizeObserver([$first, $second, $first], vi.fn()));

        const observer = ResizeObserverMock.instances[0];

        expect(observer.observe).toHaveBeenCalledTimes(2);
        expect(observer.observe).toHaveBeenCalledWith($first, {});
        expect(observer.observe).toHaveBeenCalledWith($second, {});
    });

    it('should call the latest callback', () => {
        const firstCallback = vi.fn();
        const secondCallback = vi.fn();
        const $target = document.createElement('div');
        const { rerender } = renderHook(({ callback }) => useResizeObserver([$target], callback), {
            initialProps: { callback: firstCallback },
        });
        const observer = ResizeObserverMock.instances[0];

        rerender({ callback: secondCallback });
        act(() => {
            observer.callback([], observer as unknown as ResizeObserver);
        });

        expect(firstCallback).not.toHaveBeenCalled();
        expect(secondCallback).toHaveBeenCalledWith([], observer);
    });

    it('should fallback to window resize when ResizeObserver is unavailable', () => {
        Object.defineProperty(window, 'ResizeObserver', {
            configurable: true,
            writable: true,
            value: undefined,
        });
        const callback = vi.fn();
        const $target = document.createElement('div');

        renderHook(() => useResizeObserver([$target], callback));

        act(() => {
            window.dispatchEvent(new Event('resize'));
        });

        expect(callback).toHaveBeenCalledWith([], null);
    });

    it('should skip observing when disabled', () => {
        const $target = document.createElement('div');

        renderHook(() => useResizeObserver([$target], vi.fn(), { enabled: false }));

        expect(ResizeObserverMock.instances).toHaveLength(0);
    });
});
