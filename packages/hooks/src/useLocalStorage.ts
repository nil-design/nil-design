import { isFunction } from 'lodash-es';
import { useState, useEffect, useCallback, SetStateAction, Dispatch } from 'react';

const hasWindow = () => typeof window !== 'undefined';

const useLocalStorage = <T>(key: string, defaultValue: T | (() => T)): [T, Dispatch<SetStateAction<T>>] => {
    const getStoredValue = useCallback((): T => {
        if (!hasWindow()) {
            return isFunction(defaultValue) ? defaultValue() : defaultValue;
        } else {
            try {
                const storedValue = window.localStorage.getItem(key);
                if (storedValue !== null) {
                    return JSON.parse(storedValue);
                }
                return isFunction(defaultValue) ? defaultValue() : defaultValue;
            } catch (error) {
                console.error(`Error reading localStorage key "${key}":`, error);
                return isFunction(defaultValue) ? defaultValue() : defaultValue;
            }
        }
    }, [key, defaultValue]);

    const [value, setValue] = useState<T>(getStoredValue);

    const updateValue = useCallback<Dispatch<SetStateAction<T>>>(
        nextValue => {
            setValue(prevValue => {
                const value = isFunction(nextValue) ? nextValue(prevValue) : nextValue;
                if (hasWindow()) {
                    try {
                        window.localStorage.setItem(key, JSON.stringify(value));
                    } catch (error) {
                        console.error(`Error setting localStorage key "${key}":`, error);
                    }
                }
                return value;
            });
        },
        [key],
    );

    useEffect(() => {
        if (!hasWindow()) return;

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === key && event.newValue !== event.oldValue) {
                try {
                    const newValue = event.newValue ? JSON.parse(event.newValue) : defaultValue;
                    setValue(newValue);
                } catch (error) {
                    console.error(`Error parsing storage event for key "${key}":`, error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, defaultValue]);

    useEffect(() => {
        setValue(getStoredValue());
    }, [key, getStoredValue]);

    return [value, updateValue];
};

export default useLocalStorage;
