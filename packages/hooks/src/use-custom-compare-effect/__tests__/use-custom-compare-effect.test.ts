// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import useCustomCompareEffect from '../index';

describe('useCustomCompareEffect', () => {
    it('should run effect only when dependency changes with default comparator', () => {
        const effect = vi.fn();
        const { rerender } = renderHook(
            ({ value }: { value: number }) => {
                useCustomCompareEffect(effect, [value]);
            },
            {
                initialProps: {
                    value: 1,
                },
            },
        );

        expect(effect).toHaveBeenCalledTimes(1);

        rerender({
            value: 1,
        });

        expect(effect).toHaveBeenCalledTimes(1);

        rerender({
            value: 2,
        });

        expect(effect).toHaveBeenCalledTimes(2);
    });

    it('should skip rerun when custom comparator says deps are equal', () => {
        const effect = vi.fn();
        const compare = vi.fn(() => true);
        const { rerender } = renderHook(
            ({ value }: { value: number }) => {
                useCustomCompareEffect(effect, [value], compare);
            },
            {
                initialProps: {
                    value: 1,
                },
            },
        );

        expect(effect).toHaveBeenCalledTimes(1);

        rerender({
            value: 2,
        });

        expect(compare).toHaveBeenCalled();
        expect(effect).toHaveBeenCalledTimes(1);
    });

    it('should still rely on React dependency comparison for reruns', () => {
        const effect = vi.fn();
        const compare = vi.fn(() => false);
        const { rerender } = renderHook(
            ({ value }: { value: number }) => {
                useCustomCompareEffect(effect, [value], compare);
            },
            {
                initialProps: {
                    value: 1,
                },
            },
        );

        expect(effect).toHaveBeenCalledTimes(1);

        rerender({
            value: 1,
        });

        expect(compare).toHaveBeenCalled();
        expect(effect).toHaveBeenCalledTimes(1);

        rerender({
            value: 2,
        });

        expect(effect).toHaveBeenCalledTimes(2);
    });
});
