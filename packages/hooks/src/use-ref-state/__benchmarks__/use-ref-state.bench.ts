// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { bench, describe } from 'vitest';
import useRefState from '../index';

describe('useRefState', () => {
    bench('mounts and updates state with its ref', () => {
        const { result, unmount } = renderHook(() => useRefState(0));

        act(() => result.current[1](1));
        unmount();
    });
});
