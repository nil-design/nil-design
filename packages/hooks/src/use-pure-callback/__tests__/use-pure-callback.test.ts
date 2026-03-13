// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import usePureCallback from '../index';

describe('usePureCallback', () => {
    it('should keep callback reference stable across rerenders', () => {
        const { result, rerender } = renderHook(
            ({ prefix }: { prefix: string }) => usePureCallback((value: string) => `${prefix}-${value}`),
            {
                initialProps: {
                    prefix: 'before',
                },
            },
        );
        const stableCallback = result.current;

        rerender({
            prefix: 'after',
        });

        expect(result.current).toBe(stableCallback);
    });

    it('should call latest callback implementation after rerender', () => {
        const { result, rerender } = renderHook(
            ({ prefix }: { prefix: string }) => usePureCallback((value: string) => `${prefix}-${value}`),
            {
                initialProps: {
                    prefix: 'before',
                },
            },
        );

        expect(result.current('1')).toBe('before-1');

        rerender({
            prefix: 'after',
        });

        expect(result.current('2')).toBe('after-2');
    });

    it('should preserve this binding when invoking callback', () => {
        const { result } = renderHook(() =>
            usePureCallback(function (this: { value: number }, amount: number) {
                return this.value + amount;
            }),
        );

        expect(result.current.call({ value: 2 }, 3)).toBe(5);
    });
});
