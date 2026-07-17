// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { bench, describe } from 'vitest';
import useLocalStorage from '../index';

const key = 'nild-benchmark';
const defaultValue = { count: 0 };

describe('useLocalStorage', () => {
    bench('reads, updates, and cleans up local storage state', () => {
        localStorage.removeItem(key);
        const { result, unmount } = renderHook(() => useLocalStorage(key, defaultValue));

        act(() => result.current[1]({ count: 1 }));
        unmount();
        localStorage.removeItem(key);
    });
});
