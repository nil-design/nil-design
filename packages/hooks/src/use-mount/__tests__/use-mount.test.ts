// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import useMount from '../index';

describe('useMount', () => {
    it('should run callback once on mount', () => {
        const onMount = vi.fn();

        renderHook(() => useMount(onMount));

        expect(onMount).toHaveBeenCalledTimes(1);
    });

    it('should not rerun callback after rerender', () => {
        const firstCallback = vi.fn();
        const secondCallback = vi.fn();
        const { rerender } = renderHook(({ callback }: { callback?: () => void }) => useMount(callback), {
            initialProps: {
                callback: firstCallback,
            },
        });

        rerender({
            callback: secondCallback,
        });

        expect(firstCallback).toHaveBeenCalledTimes(1);
        expect(secondCallback).not.toHaveBeenCalled();
    });
});
