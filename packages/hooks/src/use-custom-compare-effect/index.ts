import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

const areDepsEqual = (prevDeps: DependencyList, nextDeps: DependencyList) => {
    if (prevDeps === nextDeps) return true;
    for (let i = 0; i < prevDeps.length; i++) {
        if (!Object.is(prevDeps[i], nextDeps[i])) {
            return false;
        }
    }

    return true;
};

const useCustomCompareEffect = (
    effect: EffectCallback,
    deps: DependencyList,
    compare: (prevDeps: DependencyList, nextDeps: DependencyList) => boolean = areDepsEqual,
) => {
    const ref = useRef<DependencyList | undefined>(undefined);

    if (!ref.current || !compare(deps, ref.current)) {
        ref.current = deps;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, ref.current);
};

export default useCustomCompareEffect;
