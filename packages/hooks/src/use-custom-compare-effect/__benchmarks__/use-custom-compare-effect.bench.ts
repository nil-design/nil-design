// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { bench, describe } from 'vitest';
import useCustomCompareEffect from '../index';

describe('useCustomCompareEffect', () => {
    bench('mounts and compares updated dependencies', () => {
        const { rerender, unmount } = renderHook(({ value }) => useCustomCompareEffect(() => {}, [value]), {
            initialProps: { value: 0 },
        });

        rerender({ value: 1 });
        unmount();
    });
});
