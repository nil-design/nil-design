import { isBoolean, isBrowser, isNil, isUndefined } from '@nild/shared';
import { useEffect, useRef } from 'react';
import { resolveTarget } from '../_shared/utils/target';
import useIsomorphicLayoutEffect from '../use-isomorphic-layout-effect';
import type { ResolvableTarget } from '@nild/shared';

interface ScrollLockState {
    count: number;
    overflow: string;
    paddingRight: string;
}

const lockStates = new WeakMap<HTMLElement, ScrollLockState>();

const isDocument = (target: EventTarget): target is Document => {
    return 'nodeType' in target && target.nodeType === 9;
};

const hasStableScrollbarGutter = (doc: Document) => {
    const view = doc.defaultView ?? (isBrowser() ? window : null);

    if (isNil(view)) {
        return false;
    }

    return [doc.documentElement, doc.body].some(element => {
        const style = view.getComputedStyle(element);
        const scrollbarGutter =
            style.getPropertyValue('scrollbar-gutter') ||
            (style as CSSStyleDeclaration & { scrollbarGutter?: string }).scrollbarGutter ||
            '';

        return /\bstable\b/.test(scrollbarGutter);
    });
};

const resolveScrollElement = (target?: ResolvableTarget<Document | HTMLElement>) => {
    if (!isBrowser()) {
        return null;
    }

    const resolvedTarget = isUndefined(target) ? document : resolveTarget(target);

    if (isNil(resolvedTarget)) {
        return null;
    }

    return isDocument(resolvedTarget) ? resolvedTarget.body : resolvedTarget;
};

const lockElementScroll = ($element: HTMLElement) => {
    const existingState = lockStates.get($element);

    if (existingState) {
        existingState.count += 1;

        return () => {
            existingState.count = Math.max(0, existingState.count - 1);

            if (existingState.count === 0) {
                $element.style.overflow = existingState.overflow;
                $element.style.paddingRight = existingState.paddingRight;
                lockStates.delete($element);
            }
        };
    }

    const state: ScrollLockState = {
        count: 1,
        overflow: $element.style.overflow,
        paddingRight: $element.style.paddingRight,
    };
    const doc = $element.ownerDocument;
    const view = doc.defaultView ?? window;
    const locksBody = $element === doc.body;

    $element.style.overflow = 'hidden';

    if (locksBody && !hasStableScrollbarGutter(doc)) {
        const computedPaddingRight = Number.parseFloat(view.getComputedStyle($element).paddingRight || '0') || 0;
        const scrollbarWidth =
            doc.documentElement.clientWidth > 0 ? view.innerWidth - doc.documentElement.clientWidth : 0;

        if (scrollbarWidth > 0) {
            $element.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;
        }
    }

    lockStates.set($element, state);

    return () => {
        state.count = Math.max(0, state.count - 1);

        if (state.count === 0) {
            $element.style.overflow = state.overflow;
            $element.style.paddingRight = state.paddingRight;
            lockStates.delete($element);
        }
    };
};

function useScrollLock(locked?: boolean): void;
function useScrollLock(target: ResolvableTarget<Document | HTMLElement>, locked?: boolean): void;
function useScrollLock(
    targetOrLocked: ResolvableTarget<Document | HTMLElement> | boolean = true,
    maybeLocked?: boolean,
) {
    const target = isBoolean(targetOrLocked) ? undefined : targetOrLocked;
    const locked = isBoolean(targetOrLocked) ? targetOrLocked : (maybeLocked ?? true);
    const cleanupRef = useRef<VoidFunction>();
    const lockedElementRef = useRef<HTMLElement | null>(null);

    const cleanup = () => {
        cleanupRef.current?.();
        cleanupRef.current = undefined;
        lockedElementRef.current = null;
    };

    useIsomorphicLayoutEffect(() => {
        const nextElement = locked ? resolveScrollElement(target) : null;

        if (lockedElementRef.current === nextElement) {
            return;
        }

        cleanup();

        if (!nextElement) {
            return;
        }

        lockedElementRef.current = nextElement;
        cleanupRef.current = lockElementScroll(nextElement);
    });

    useEffect(() => cleanup, []);
}

export default useScrollLock;
