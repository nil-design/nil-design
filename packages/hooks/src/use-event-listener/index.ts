import { PossibleTarget } from '@nild/shared';
import { useEffect } from 'react';
import useLatestRef from '../use-latest-ref';

function useEventListener<K extends keyof WindowEventMap>(
    target: PossibleTarget<Window>,
    eventName: K,
    listener: (event: WindowEventMap[K]) => void,
    options?: AddEventListenerOptions,
): void;

function useEventListener<K extends keyof DocumentEventMap>(
    target: PossibleTarget<Document>,
    eventName: K,
    listener: (event: DocumentEventMap[K]) => void,
    options?: AddEventListenerOptions,
): void;

function useEventListener<K extends keyof HTMLElementEventMap, T extends HTMLElement = HTMLElement>(
    target: PossibleTarget<T>,
    eventName: K,
    listener: (event: HTMLElementEventMap[K]) => void,
    options?: AddEventListenerOptions,
): void;

function useEventListener<K extends keyof ElementEventMap>(
    target: PossibleTarget<Element>,
    eventName: K,
    listener: (event: ElementEventMap[K]) => void,
    options?: AddEventListenerOptions,
): void;

function useEventListener<K = Event>(
    target: PossibleTarget<EventTarget>,
    eventName: K,
    listener: (event: K) => void,
    options?: AddEventListenerOptions,
): void;

function useEventListener(
    target: PossibleTarget,
    eventName: string,
    listener: (...args: unknown[]) => void,
    options?: AddEventListenerOptions,
): void;

function useEventListener(
    target: PossibleTarget,
    eventName: string,
    listener: (...args: unknown[]) => void,
    options?: AddEventListenerOptions,
) {
    const listenerRef = useLatestRef(listener);

    useEffect(() => {
        if (!target?.addEventListener) {
            return;
        }

        const eventListener = (event: Event) => {
            listenerRef.current(event);
        };

        target.addEventListener(eventName, eventListener, options);

        return () => {
            target.removeEventListener(eventName, eventListener, options);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, eventName, options?.capture, options?.once, options?.passive, options?.signal]);
}

export default useEventListener;
