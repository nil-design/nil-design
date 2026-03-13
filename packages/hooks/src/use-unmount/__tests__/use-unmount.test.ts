// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import useUnmount from '../index';

describe('useUnmount', () => {
    it('should run callback on unmount', () => {
        const onUnmount = vi.fn();
        const { unmount } = renderHook(() => useUnmount(onUnmount));

        unmount();

        expect(onUnmount).toHaveBeenCalledTimes(1);
    });

    it('should use latest callback when unmounting', () => {
        const firstCallback = vi.fn();
        const secondCallback = vi.fn();
        const { rerender, unmount } = renderHook(({ callback }: { callback?: () => void }) => useUnmount(callback), {
            initialProps: {
                callback: firstCallback,
            },
        });

        rerender({
            callback: secondCallback,
        });

        unmount();

        expect(firstCallback).not.toHaveBeenCalled();
        expect(secondCallback).toHaveBeenCalledTimes(1);
    });
});
