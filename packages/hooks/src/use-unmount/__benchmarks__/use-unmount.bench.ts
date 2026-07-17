// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { bench, describe } from 'vitest';
import useUnmount from '../index';

describe('useUnmount', () => {
    bench('mounts and invokes an unmount callback', () => {
        const { unmount } = renderHook(() => useUnmount(() => {}));

        unmount();
    });
});
