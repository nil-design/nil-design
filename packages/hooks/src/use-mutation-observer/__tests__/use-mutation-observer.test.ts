// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useMutationObserver from '../index';

class MutationObserverMock {
    static instances: MutationObserverMock[] = [];

    observe = vi.fn();
    disconnect = vi.fn();

    constructor(public callback: MutationCallback) {
        MutationObserverMock.instances.push(this);
    }
}

describe('useMutationObserver', () => {
    beforeEach(() => {
        MutationObserverMock.instances = [];
        vi.stubGlobal('MutationObserver', MutationObserverMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should observe a ref target and disconnect on unmount', () => {
        const $target = document.createElement('div');
        const targetRef = { current: $target };
        const { unmount } = renderHook(() => useMutationObserver([targetRef], vi.fn(), { childList: true }));
        const observer = MutationObserverMock.instances[0];

        expect(observer.observe).toHaveBeenCalledWith($target, { childList: true });

        unmount();

        expect(observer.disconnect).toHaveBeenCalledTimes(1);
    });

    it('should observe multiple targets once', () => {
        const $first = document.createElement('div');
        const $second = document.createElement('div');

        renderHook(() => useMutationObserver([$first, $second, $first], vi.fn(), { childList: true }));

        const observer = MutationObserverMock.instances[0];

        expect(observer.observe).toHaveBeenCalledTimes(2);
        expect(observer.observe).toHaveBeenCalledWith($first, { childList: true });
        expect(observer.observe).toHaveBeenCalledWith($second, { childList: true });
    });

    it('should call the latest callback', () => {
        const firstCallback = vi.fn();
        const secondCallback = vi.fn();
        const $target = document.createElement('div');
        const { rerender } = renderHook(
            ({ callback }) => useMutationObserver([$target], callback, { childList: true }),
            {
                initialProps: { callback: firstCallback },
            },
        );
        const observer = MutationObserverMock.instances[0];

        rerender({ callback: secondCallback });
        act(() => {
            observer.callback([], observer as unknown as MutationObserver);
        });

        expect(firstCallback).not.toHaveBeenCalled();
        expect(secondCallback).toHaveBeenCalledWith([], observer);
    });

    it('should skip observing when disabled', () => {
        const $target = document.createElement('div');

        renderHook(() => useMutationObserver([$target], vi.fn(), { childList: true, enabled: false }));

        expect(MutationObserverMock.instances).toHaveLength(0);
    });

    it('should skip observing when MutationObserver is unavailable', () => {
        vi.stubGlobal('MutationObserver', undefined);
        const $target = document.createElement('div');

        expect(() => {
            renderHook(() => useMutationObserver([$target], vi.fn(), { childList: true }));
        }).not.toThrow();
    });
});
