// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import useLatestRef from '../index';

describe('useLatestRef', () => {
    it('should return the same ref object across rerenders', () => {
        const { result, rerender } = renderHook(({ value }: { value: number }) => useLatestRef(value), {
            initialProps: {
                value: 1,
            },
        });
        const firstRef = result.current;

        rerender({
            value: 2,
        });

        expect(result.current).toBe(firstRef);
    });

    it('should always point to the latest value', () => {
        const { result, rerender } = renderHook(({ value }: { value: string }) => useLatestRef(value), {
            initialProps: {
                value: 'before',
            },
        });

        expect(result.current.current).toBe('before');

        rerender({
            value: 'after',
        });

        expect(result.current.current).toBe('after');
    });
});
