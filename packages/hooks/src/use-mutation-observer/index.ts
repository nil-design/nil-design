import { isUndefined } from '@nild/shared';
import { useEffect, useRef } from 'react';
import { isSameTargets, resolveTargets } from '../_shared/utils/target';
import useLatestRef from '../use-latest-ref';
import type { ResolvableTarget } from '@nild/shared';

type UseMutationObserverOptions = MutationObserverInit & {
    enabled?: boolean;
};

interface Binding {
    key: string;
    targets: Node[];
}

const getOptionsKey = (options: UseMutationObserverOptions) => {
    const {
        enabled = true,
        attributeFilter,
        attributeOldValue,
        attributes,
        characterData,
        characterDataOldValue,
        childList,
        subtree,
    } = options;

    return JSON.stringify({
        enabled,
        attributeFilter,
        attributeOldValue,
        attributes,
        characterData,
        characterDataOldValue,
        childList,
        subtree,
    });
};

const getMutationObserver = () => {
    return (globalThis as typeof globalThis & { MutationObserver?: typeof MutationObserver }).MutationObserver;
};

const useMutationObserver = <T extends Node>(
    targets: readonly ResolvableTarget<T>[],
    callback: MutationCallback,
    options: UseMutationObserverOptions,
) => {
    const callbackRef = useLatestRef(callback);
    const cleanupRef = useRef<VoidFunction>();
    const bindingRef = useRef<Binding>({ key: '', targets: [] });

    const cleanup = () => {
        cleanupRef.current?.();
        cleanupRef.current = undefined;
        bindingRef.current = { key: '', targets: [] };
    };

    useEffect(() => {
        const { enabled = true, ...observerOptions } = options;
        const resolvedTargets = enabled ? resolveTargets(targets) : [];
        const key = getOptionsKey(options);
        const binding = bindingRef.current;

        if (binding.key === key && isSameTargets(binding.targets, resolvedTargets)) {
            return;
        }

        cleanup();

        const MutationObserverCtor = getMutationObserver();

        if (!enabled || resolvedTargets.length === 0 || isUndefined(MutationObserverCtor)) {
            return;
        }

        const observer = new MutationObserverCtor((records, observer) => {
            callbackRef.current(records, observer);
        });

        resolvedTargets.forEach($target => {
            observer.observe($target, observerOptions);
        });

        cleanupRef.current = () => {
            observer.disconnect();
        };
        bindingRef.current = { key, targets: resolvedTargets };
    });

    useEffect(() => cleanup, []);
};

export default useMutationObserver;
