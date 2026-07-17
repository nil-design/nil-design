// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { bench, describe } from 'vitest';
import useLatestRef from '../index';

describe('useLatestRef', () => {
    bench('updates a ref without changing its identity', () => {
        const { rerender, unmount } = renderHook(({ value }) => useLatestRef(value), {
            initialProps: { value: 0 },
        });

        rerender({ value: 1 });
        unmount();
    });
});
