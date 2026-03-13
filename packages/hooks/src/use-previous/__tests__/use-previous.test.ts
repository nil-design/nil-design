// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import usePrevious from '../index';

describe('usePrevious', () => {
    it('should return undefined on initial render', () => {
        const { result } = renderHook(() => usePrevious(1));

        expect(result.current).toBeUndefined();
    });

    it('should return previous value when current value changes', () => {
        const { result, rerender } = renderHook(({ value }: { value: number }) => usePrevious(value), {
            initialProps: {
                value: 1,
            },
        });

        rerender({
            value: 2,
        });

        expect(result.current).toBe(1);
    });

    it('should respect custom shouldUpdate comparator', () => {
        const { result, rerender } = renderHook(
            ({ value }: { value: number }) => usePrevious(value, (current, next) => Math.abs(current - next) >= 2),
            {
                initialProps: {
                    value: 1,
                },
            },
        );

        rerender({
            value: 2,
        });

        expect(result.current).toBeUndefined();

        rerender({
            value: 4,
        });

        expect(result.current).toBe(1);
    });
});
