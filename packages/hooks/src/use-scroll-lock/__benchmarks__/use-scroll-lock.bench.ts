// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { bench, describe } from 'vitest';
import useScrollLock from '../index';

describe('useScrollLock', () => {
    bench('locks and restores document scrolling', () => {
        const { unmount } = renderHook(() => useScrollLock(document.body, true));

        unmount();
    });
});
