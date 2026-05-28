import { isNil } from '@nild/shared';
import { useEffect, useRef } from 'react';
import { resolveTarget } from '../_shared/utils/target';
import useLatestRef from '../use-latest-ref';
import type { ResolvableTarget } from '@nild/shared';

function useEventListener<K extends keyof WindowEventMap>(
    target: ResolvableTarget<Window>,
    eventName: K,
    listener: (event: WindowEventMap[K]) => void,
    options?: AddEventListenerOptions,
): void;

function useEventListener<K extends keyof DocumentEventMap>(
    target: ResolvableTarget<Document>,
    eventName: K,
    listener: (event: DocumentEventMap[K]) => void,
    options?: AddEventListenerOptions,
): void;

function useEventListener<K extends keyof HTMLElementEventMap, T extends HTMLElement = HTMLElement>(
    target: ResolvableTarget<T>,
    eventName: K,
    listener: (event: HTMLElementEventMap[K]) => void,
    options?: AddEventListenerOptions,
): void;

function useEventListener<K extends keyof ElementEventMap>(
    target: ResolvableTarget<Element>,
    eventName: K,
    listener: (event: ElementEventMap[K]) => void,
    options?: AddEventListenerOptions,
): void;

function useEventListener<K = Event>(
    target: ResolvableTarget<EventTarget>,
    eventName: K,
    listener: (event: K) => void,
    options?: AddEventListenerOptions,
): void;

function useEventListener(
    target: ResolvableTarget,
    eventName: string,
    listener: (...args: unknown[]) => void,
    options?: AddEventListenerOptions,
): void;

function useEventListener(
    target: ResolvableTarget,
    eventName: string,
    listener: (...args: unknown[]) => void,
    options?: AddEventListenerOptions,
) {
    const listenerRef = useLatestRef(listener);
    const cleanupRef = useRef<VoidFunction>();
    const bindingRef = useRef<{
        target: EventTarget | null;
        eventName: string;
        capture?: boolean;
        once?: boolean;
        passive?: boolean;
        signal?: AbortSignal | null;
    }>({
        target: null,
        eventName: '',
    });

    const cleanup = () => {
        cleanupRef.current?.();
        cleanupRef.current = undefined;
        bindingRef.current = { target: null, eventName: '' };
    };

    useEffect(() => {
        const resolvedTarget = resolveTarget(target);
        const nextBinding = {
            target: resolvedTarget,
            eventName,
            capture: options?.capture,
            once: options?.once,
            passive: options?.passive,
            signal: options?.signal,
        };
        const binding = bindingRef.current;

        if (
            binding.target === nextBinding.target &&
            binding.eventName === nextBinding.eventName &&
            binding.capture === nextBinding.capture &&
            binding.once === nextBinding.once &&
            binding.passive === nextBinding.passive &&
            binding.signal === nextBinding.signal
        ) {
            return;
        }

        cleanup();

        if (isNil(resolvedTarget)) {
            return;
        }

        const eventListener = (event: Event) => {
            listenerRef.current(event);
        };

        resolvedTarget.addEventListener(eventName, eventListener, options);
        cleanupRef.current = () => {
            resolvedTarget.removeEventListener(eventName, eventListener, options);
        };
        bindingRef.current = nextBinding;
    });

    useEffect(() => cleanup, []);
}

export default useEventListener;
