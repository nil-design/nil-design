import { useInsertionEffect, useRef } from 'react';
import type { AnyCallback, StableCallback } from '../_shared/interfaces';

/**
 * Provide stable callback references and ensure the latest state when calling
 * @description The callback can contain side effects, but it can only be used in useLayoutEffect, useEffect or event callbacks
 * @warning If the callback is passed to the child component, then it can be used in the child component's useEffect and event callbacks
 */
export function useEffectCallback<T extends AnyCallback>(callback: T) {
    const cbRef = useRef(callback);
    const stableRef = useRef<StableCallback<T>>();

    if (!stableRef.current) {
        stableRef.current = function (this, ...args) {
            return cbRef.current.apply(this, args);
        };
    }

    useInsertionEffect(() => {
        cbRef.current = callback;
    }, [callback]);

    return stableRef.current;
}

export default useEffectCallback;
