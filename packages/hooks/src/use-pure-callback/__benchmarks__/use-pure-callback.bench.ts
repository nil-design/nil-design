// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { bench, describe } from 'vitest';
import usePureCallback from '../index';

describe('usePureCallback', () => {
    bench('keeps a pure callback stable across updates', () => {
        const { result, rerender, unmount } = renderHook(({ value }) => usePureCallback(() => value), {
            initialProps: { value: 0 },
        });

        rerender({ value: 1 });
        result.current();
        unmount();
    });
});
