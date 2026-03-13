// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import useEventListener from '../index';

describe('useEventListener', () => {
    it('should bind listener to target and remove listener on unmount', () => {
        const listener = vi.fn();
        const { unmount } = renderHook(() => {
            useEventListener(window, 'click', listener);
        });

        act(() => {
            window.dispatchEvent(new MouseEvent('click'));
        });

        expect(listener).toHaveBeenCalledTimes(1);

        unmount();

        act(() => {
            window.dispatchEvent(new MouseEvent('click'));
        });

        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should call latest listener without rebinding event', () => {
        const firstListener = vi.fn();
        const secondListener = vi.fn();
        const { rerender } = renderHook(
            ({ listener }: { listener: (event: MouseEvent) => void }) => {
                useEventListener(window, 'click', listener);
            },
            {
                initialProps: {
                    listener: firstListener,
                },
            },
        );

        rerender({
            listener: secondListener,
        });

        act(() => {
            window.dispatchEvent(new MouseEvent('click'));
        });

        expect(firstListener).not.toHaveBeenCalled();
        expect(secondListener).toHaveBeenCalledTimes(1);
    });

    it('should skip binding when target is unavailable', () => {
        expect(() => {
            renderHook(() => {
                useEventListener(undefined, 'click', vi.fn());
            });
        }).not.toThrow();
    });
});
