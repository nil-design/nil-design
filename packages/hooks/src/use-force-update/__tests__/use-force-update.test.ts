// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it } from 'vitest';
import useForceUpdate from '../index';

describe('useForceUpdate', () => {
    it('should trigger a rerender when called', () => {
        const { result } = renderHook(() => {
            const forceUpdate = useForceUpdate();
            const renderCountRef = useRef(0);

            renderCountRef.current += 1;

            return {
                forceUpdate,
                renderCount: renderCountRef.current,
            };
        });

        expect(result.current.renderCount).toBe(1);

        act(() => {
            result.current.forceUpdate();
        });

        expect(result.current.renderCount).toBe(2);
    });
});
