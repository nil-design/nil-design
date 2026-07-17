// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { bench, describe } from 'vitest';
import useControllableState from '../index';

describe('useControllableState', () => {
    bench('mounts and updates uncontrolled state', () => {
        const { result } = renderHook(() => useControllableState(undefined, 0));

        act(() => result.current[1](1));
        cleanup();
    });
});
