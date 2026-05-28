import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import useRefState from '../index';

describe('useRefState', () => {
    it('should initialize state and ref with the same value', () => {
        const { result } = renderHook(() => useRefState(1));

        expect(result.current[0]).toBe(1);
        expect(result.current[2].current).toBe(1);
    });

    it('should resolve lazy initial state once', () => {
        const initializer = vi.fn(() => 1);
        const { rerender, result } = renderHook(() => useRefState(initializer));

        rerender();

        expect(initializer).toHaveBeenCalledTimes(1);
        expect(result.current[0]).toBe(1);
    });

    it('should update ref immediately when dispatching state', () => {
        const { result } = renderHook(() => useRefState(0));

        act(() => {
            const [, setState, stateRef] = result.current;

            setState(value => value + 1);
            expect(stateRef.current).toBe(1);

            setState(value => value + 1);
            expect(stateRef.current).toBe(2);
        });

        expect(result.current[0]).toBe(2);
        expect(result.current[2].current).toBe(2);
    });
});
