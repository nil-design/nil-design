// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { bench, describe } from 'vitest';
import useEffectCallback from '../index';

describe('useEffectCallback', () => {
    bench('keeps a stable callback across updates', () => {
        const { result, rerender, unmount } = renderHook(({ value }) => useEffectCallback(() => value), {
            initialProps: { value: 0 },
        });

        rerender({ value: 1 });
        result.current();
        unmount();
    });
});
