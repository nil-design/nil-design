// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import useScrollLock from '../index';

describe('useScrollLock', () => {
    const originalInnerWidth = window.innerWidth;
    const originalClientWidthDescriptor = Object.getOwnPropertyDescriptor(document.documentElement, 'clientWidth');

    beforeEach(() => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalInnerWidth });
    });

    afterEach(() => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalInnerWidth });

        if (originalClientWidthDescriptor) {
            Object.defineProperty(document.documentElement, 'clientWidth', originalClientWidthDescriptor);
        }
    });

    it('should lock the document body by default', () => {
        const { unmount } = renderHook(() => useScrollLock());

        expect(document.body.style.overflow).toBe('hidden');

        unmount();

        expect(document.body.style.overflow).toBe('');
    });

    it('should compensate body padding for the scrollbar width', () => {
        document.body.style.paddingRight = '8px';
        Object.defineProperty(window, 'innerWidth', { configurable: true, value: 120 });
        Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: 100 });

        const { unmount } = renderHook(() => useScrollLock(document));

        expect(document.body.style.paddingRight).toBe('28px');

        unmount();

        expect(document.body.style.paddingRight).toBe('8px');
    });

    it('should keep body locked until every lock is released', () => {
        const first = renderHook(() => useScrollLock(document));
        const second = renderHook(() => useScrollLock(document));

        first.unmount();

        expect(document.body.style.overflow).toBe('hidden');

        second.unmount();

        expect(document.body.style.overflow).toBe('');
    });

    it('should lock an element target without changing body styles', () => {
        const $target = document.createElement('div');
        const { unmount } = renderHook(() => useScrollLock($target));

        expect($target.style.overflow).toBe('hidden');
        expect(document.body.style.overflow).toBe('');

        unmount();

        expect($target.style.overflow).toBe('');
    });

    it('should resolve ref targets', () => {
        const targetRef = createRef<HTMLDivElement>();

        targetRef.current = document.createElement('div');
        const { unmount } = renderHook(() => useScrollLock(targetRef));

        expect(targetRef.current.style.overflow).toBe('hidden');

        unmount();

        expect(targetRef.current.style.overflow).toBe('');
    });

    it('should skip locking when disabled', () => {
        renderHook(() => useScrollLock(false));

        expect(document.body.style.overflow).toBe('');
    });
});
