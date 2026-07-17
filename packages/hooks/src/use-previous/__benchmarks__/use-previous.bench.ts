// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { bench, describe } from 'vitest';
import usePrevious from '../index';

describe('usePrevious', () => {
    bench('tracks a value across updates', () => {
        const { rerender, unmount } = renderHook(({ value }) => usePrevious(value), {
            initialProps: { value: 0 },
        });

        rerender({ value: 1 });
        unmount();
    });
});
