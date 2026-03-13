// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useLocalStorage from '../index';

describe('useLocalStorage', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should read initial value from localStorage when key exists', () => {
        window.localStorage.setItem('username', JSON.stringify('Alice'));

        const { result } = renderHook(() => useLocalStorage('username', 'Bob'));

        expect(result.current[0]).toBe('Alice');
    });

    it('should use default value when localStorage key does not exist', () => {
        const getDefaultValue = vi.fn(() => 'fallback');

        const { result } = renderHook(() => useLocalStorage('missing', getDefaultValue));

        expect(result.current[0]).toBe('fallback');
        expect(getDefaultValue).toHaveBeenCalled();
    });

    it('should update state and write serialized value to localStorage', () => {
        const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
        const { result } = renderHook(() => useLocalStorage<number>('count', 0));

        act(() => {
            result.current[1](prev => prev + 1);
        });

        expect(result.current[0]).toBe(1);
        expect(setItemSpy).toHaveBeenCalledWith('count', '1');
    });

    it('should update state when matching storage event is dispatched', () => {
        const { result } = renderHook(() => useLocalStorage<number>('count', 0));

        act(() => {
            window.dispatchEvent(
                new StorageEvent('storage', {
                    key: 'count',
                    oldValue: '0',
                    newValue: '3',
                }),
            );
        });

        expect(result.current[0]).toBe(3);
    });

    it('should call onError and fall back to default when deserialization fails', () => {
        window.localStorage.setItem('broken', '{invalid-json');
        const onError = vi.fn();
        const { result } = renderHook(() => useLocalStorage('broken', 'fallback', { onError }));

        expect(onError).toHaveBeenCalled();
        expect(result.current[0]).toBe('fallback');
    });
});
