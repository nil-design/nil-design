// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { bench, describe } from 'vitest';
import useForceUpdate from '../index';

describe('useForceUpdate', () => {
    bench('mounts and forces an update', () => {
        const { result, unmount } = renderHook(() => useForceUpdate());

        act(() => result.current());
        unmount();
    });
});
