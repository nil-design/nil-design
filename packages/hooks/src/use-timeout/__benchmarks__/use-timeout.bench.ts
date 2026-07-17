// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { bench, describe } from 'vitest';
import useTimeout from '../index';

describe('useTimeout', () => {
    bench('schedules and cancels a timeout', () => {
        const { result, unmount } = renderHook(() => useTimeout(() => {}));

        act(() => {
            result.current.run(1_000);
            result.current.cancel();
        });
        unmount();
    });
});
