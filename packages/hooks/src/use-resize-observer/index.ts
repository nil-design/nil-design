import { isBrowser, isUndefined } from '@nild/shared';
import { useEffect, useRef } from 'react';
import { isSameTargets, resolveTargets } from '../_shared/utils/target';
import useLatestRef from '../use-latest-ref';
import type { ResolvableTarget } from '@nild/shared';

type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver | null) => void;

type UseResizeObserverOptions = ResizeObserverOptions & {
    enabled?: boolean;
    fallbackToWindow?: boolean;
};

interface Binding {
    key: string;
    targets: Element[];
}

const getResizeObserver = () => {
    return isBrowser() ? (window as Window & { ResizeObserver?: typeof ResizeObserver }).ResizeObserver : undefined;
};

const useResizeObserver = <T extends Element>(
    targets: readonly ResolvableTarget<T>[],
    callback: ResizeObserverCallback,
    options: UseResizeObserverOptions = {},
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
        const { enabled = true, fallbackToWindow = true, ...observerOptions } = options;
        const resolvedTargets = enabled ? resolveTargets(targets) : [];
        const key = `${enabled}|${fallbackToWindow}|${observerOptions.box ?? ''}`;
        const binding = bindingRef.current;

        if (binding.key === key && isSameTargets(binding.targets, resolvedTargets)) {
            return;
        }

        cleanup();

        if (!enabled || resolvedTargets.length === 0) {
            return;
        }

        const ResizeObserverCtor = getResizeObserver();

        if (!isUndefined(ResizeObserverCtor)) {
            const observer = new ResizeObserverCtor(entries => {
                callbackRef.current(entries, observer);
            });

            resolvedTargets.forEach($target => {
                observer.observe($target, observerOptions);
            });

            cleanupRef.current = () => {
                observer.disconnect();
            };
            bindingRef.current = { key, targets: resolvedTargets };

            return;
        }

        if (!fallbackToWindow || !isBrowser()) {
            return;
        }

        const handleResize = () => {
            callbackRef.current([], null);
        };

        window.addEventListener('resize', handleResize);
        cleanupRef.current = () => {
            window.removeEventListener('resize', handleResize);
        };
        bindingRef.current = { key, targets: resolvedTargets };
    });

    useEffect(() => cleanup, []);
};

export default useResizeObserver;
