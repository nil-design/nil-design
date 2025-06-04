import { useRef } from 'react';
import useLatest from '../use-latest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyCallback = (...args: any[]) => any;

type StableCallback<T extends AnyCallback> = (this: ThisParameterType<T>, ...args: Parameters<T>) => ReturnType<T>;

export function useStableCallback<T extends AnyCallback>(callback: T) {
    const cbRef = useLatest(callback);
    const stableRef = useRef<StableCallback<T>>();

    if (!stableRef.current) {
        stableRef.current = function (this, ...args) {
            return cbRef.current.apply(this, args);
        };
    }

    return stableRef.current;
}

export default useStableCallback;
