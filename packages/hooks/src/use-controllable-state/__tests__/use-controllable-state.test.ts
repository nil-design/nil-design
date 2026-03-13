// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import useControllableState from '../index';

describe('useControllableState', () => {
    it('should use internal state when controlled value is undefined', () => {
        const { result } = renderHook(() => useControllableState<string>(undefined, 'default'));

        expect(result.current[0]).toBe('default');

        act(() => {
            result.current[1]('updated');
        });

        expect(result.current[0]).toBe('updated');
    });

    it('should use controlled value and only change when parent value changes', () => {
        const { result, rerender } = renderHook(
            ({ controlled }: { controlled: string | undefined }) => useControllableState<string>(controlled, 'default'),
            {
                initialProps: {
                    controlled: 'external',
                },
            },
        );

        act(() => {
            result.current[1]('ignored');
        });

        expect(result.current[0]).toBe('external');

        rerender({
            controlled: 'next',
        });

        expect(result.current[0]).toBe('next');
    });

    it('should pass current controlled value to functional updater', () => {
        const updater = vi.fn((value: string) => `${value}-new`);
        const { result } = renderHook(() => useControllableState<string>('external', 'default'));

        act(() => {
            result.current[1](updater);
        });

        expect(updater).toHaveBeenCalledTimes(1);
        expect(updater).toHaveBeenCalledWith('external');
    });
});
