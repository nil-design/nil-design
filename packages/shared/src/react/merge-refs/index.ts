import { isFunction, isObject } from 'lodash-es';
import { PossibleRef } from '../../interfaces';
import type { MutableRefObject, RefCallback } from 'react';

const mergeRefs = <T>(...refs: PossibleRef<T>[]): RefCallback<T> => {
    return (node: T | null) => {
        const clears: VoidFunction[] = [];

        for (const ref of refs) {
            if (!ref) continue;

            if (isFunction(ref)) {
                const clear = ref(node);
                isFunction(clear) && clears.push(clear);
            } else if (isObject(ref) && 'current' in ref) {
                (ref as MutableRefObject<T | null>).current = node;
            }
        }

        if (clears.length) {
            return () => {
                for (const clear of clears) {
                    clear();
                }
            };
        }
    };
};

export default mergeRefs;
