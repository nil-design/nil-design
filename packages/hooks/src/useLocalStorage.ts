import { isBrowser, isFunction } from '@nild/shared/utils';
import { useState, useEffect, useCallback, SetStateAction, Dispatch } from 'react';

const useLocalStorage = <T>(
    key: string,
    defaultValue: T | (() => T),
    options?: {
        serializer?: (value: T) => string;
        deserializer?: (value: string) => T;
        onError?: (error: unknown) => void;
    },
): [T, Dispatch<SetStateAction<T>>] => {
    // eslint-disable-next-line no-console
    const { serializer = JSON.stringify, deserializer = JSON.parse, onError = console.error } = options || {};

    const getStoredValue = useCallback((): T => {
        if (!isBrowser()) {
            return isFunction(defaultValue) ? defaultValue() : defaultValue;
        } else {
            try {
                const storedValue = window.localStorage.getItem(key);
                if (storedValue !== null) {
                    return deserializer(storedValue);
                }
            } catch (error) {
                onError?.(error);
            }
            return isFunction(defaultValue) ? defaultValue() : defaultValue;
        }
    }, [defaultValue, key, deserializer, onError]);

    const [value, setValue] = useState<T>(getStoredValue);

    const updateValue = useCallback<Dispatch<SetStateAction<T>>>(
        nextValue => {
            setValue(prevValue => {
                const value = isFunction(nextValue) ? nextValue(prevValue) : nextValue;
                if (isBrowser()) {
                    try {
                        window.localStorage.setItem(key, serializer(value));
                    } catch (error) {
                        onError?.(error);
                    }
                }
                return value;
            });
        },
        [key, onError, serializer],
    );

    useEffect(() => {
        if (!isBrowser()) return;

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === key && event.newValue !== event.oldValue) {
                try {
                    const newValue = event.newValue ? JSON.parse(event.newValue) : defaultValue;
                    setValue(newValue);
                } catch (error) {
                    onError?.(error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, defaultValue, onError]);

    useEffect(() => {
        setValue(getStoredValue());
    }, [key, getStoredValue]);

    return [value, updateValue];
};

export default useLocalStorage;
