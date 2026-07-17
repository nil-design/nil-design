// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { bench, describe } from 'vitest';
import useMount from '../index';

describe('useMount', () => {
    bench('mounts and unmounts a mount callback', () => {
        const { unmount } = renderHook(() => useMount(() => {}));

        unmount();
    });
});
