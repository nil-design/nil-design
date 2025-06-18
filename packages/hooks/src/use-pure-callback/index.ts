import { useRef } from 'react';
import useLatestRef from '../use-latest-ref';
import type { AnyCallback, StableCallback } from '../_shared/interfaces';

/**
 * Provide stable callback references and ensure the latest state when calling
 * @description The callback must be a pure function to ensure its use anywhere
 */
export function usePureCallback<T extends AnyCallback>(callback: T) {
    const cbRef = useLatestRef(callback);
    const stableRef = useRef<StableCallback<T>>();

    if (!stableRef.current) {
        stableRef.current = function (this, ...args) {
            return cbRef.current.apply(this, args);
        };
    }

    return stableRef.current;
}

export default usePureCallback;
