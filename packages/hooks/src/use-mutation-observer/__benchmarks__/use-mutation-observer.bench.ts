// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { bench, describe } from 'vitest';
import useMutationObserver from '../index';

describe('useMutationObserver', () => {
    bench('binds and disconnects a mutation observer', () => {
        const $target = document.createElement('div');
        const { unmount } = renderHook(() => useMutationObserver([$target], () => {}, { childList: true }));

        unmount();
    });
});
