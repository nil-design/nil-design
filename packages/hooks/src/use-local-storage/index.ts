import { isBrowser, isFunction, isNil } from '@nild/shared';
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
    const storage = isBrowser() ? window.localStorage : null;
    // eslint-disable-next-line no-console
    const { serializer = JSON.stringify, deserializer = JSON.parse, onError = console.error } = options ?? {};

    const getDefaultValue = useCallback(() => {
        return isFunction(defaultValue) ? defaultValue() : defaultValue;
    }, [defaultValue]);

    const getStoredValue = useCallback((): T => {
        try {
            const storedValue = storage?.getItem(key);

            if (!isNil(storedValue)) {
                return deserializer(storedValue);
            }
        } catch (error) {
            onError?.(error);
        }

        return getDefaultValue();
    }, [getDefaultValue, storage, key, deserializer, onError]);

    const [value, setValue] = useState<T>(getStoredValue);

    const updateValue = useCallback<Dispatch<SetStateAction<T>>>(
        nextValue => {
            setValue(prevValue => {
                const value = isFunction(nextValue) ? nextValue(prevValue) : nextValue;

                try {
                    storage?.setItem(key, serializer(value));
                } catch (error) {
                    onError?.(error);
                }

                return value;
            });
        },
        [key, onError, serializer, storage],
    );

    useEffect(() => {
        if (!isBrowser()) return;

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === key && event.newValue !== event.oldValue) {
                try {
                    const newValue = isNil(event.newValue) ? getDefaultValue() : deserializer(event.newValue);

                    setValue(newValue);
                } catch (error) {
                    onError?.(error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, getDefaultValue, onError, deserializer]);

    useEffect(() => {
        setValue(getStoredValue());
    }, [key, getStoredValue]);

    return [value, updateValue];
};

export default useLocalStorage;
