import { isObject } from '@nild/shared';
import type { ResolvableTarget } from '@nild/shared';
import type { RefObject } from 'react';

const isRefObject = <T extends EventTarget>(target: ResolvableTarget<T>): target is RefObject<T | null | undefined> => {
    return isObject(target) && 'current' in target;
};

export const resolveTarget = <T extends EventTarget>(target: ResolvableTarget<T>): T | null => {
    if (isRefObject(target)) {
        return target.current ?? null;
    }

    return target ?? null;
};

export const resolveTargets = <T extends EventTarget>(targets: readonly ResolvableTarget<T>[]) => {
    const resolvedTargets: T[] = [];

    targets.forEach(item => {
        const resolvedTarget = resolveTarget(item);

        if (resolvedTarget && !resolvedTargets.includes(resolvedTarget)) {
            resolvedTargets.push(resolvedTarget);
        }
    });

    return resolvedTargets;
};

export const isSameTargets = <T extends EventTarget>(a: readonly T[], b: readonly T[]) => {
    return a.length === b.length && a.every((target, index) => target === b[index]);
};
