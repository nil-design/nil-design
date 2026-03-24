import { useEffectCallback, useEventListener, useIsomorphicLayoutEffect } from '@nild/hooks';
import { RefObject, useEffect, useRef } from 'react';

interface UseModalFocusScopeOptions {
    open: boolean;
    trapFocus: boolean;
    restoreFocus: boolean;
    topmost: boolean;
    ownerDocument: Document | null;
    surfaceRef: RefObject<HTMLElement>;
    triggerRef: RefObject<Element>;
}

const focusableSelectors = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'iframe',
    'summary',
    '[contenteditable="true"]',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

const isElementVisible = (element: HTMLElement) => {
    const view = element.ownerDocument.defaultView;

    if (!view) {
        return !element.hidden;
    }

    const style = view.getComputedStyle(element);

    return style.display !== 'none' && style.visibility !== 'hidden' && !element.hidden;
};

const getFocusableElements = (container: HTMLElement) => {
    return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors)).filter(element => {
        return (
            !element.hasAttribute('disabled') &&
            element.getAttribute('aria-hidden') !== 'true' &&
            element.tabIndex >= 0 &&
            isElementVisible(element)
        );
    });
};

const focusWithin = (container: HTMLElement, fromEnd = false) => {
    const focusableEls = getFocusableElements(container);
    const focusableEl = focusableEls.at(fromEnd ? -1 : 0) ?? container;

    focusableEl.focus();

    return focusableEl;
};

const restoreFocusTo = (target?: HTMLElement | null, fallback?: HTMLElement | null) => {
    const resolvedTarget = target?.isConnected ? target : fallback?.isConnected ? fallback : null;

    resolvedTarget?.focus?.();
};

export const useModalFocusScope = ({
    open,
    trapFocus,
    restoreFocus,
    topmost,
    ownerDocument,
    surfaceRef,
    triggerRef,
}: UseModalFocusScopeOptions) => {
    const lastActiveElRef = useRef<HTMLElement | null>(null);
    const openRef = useRef(open);

    const handleKeyDown = useEffectCallback((evt: KeyboardEvent) => {
        const surface = surfaceRef.current;

        if (!surface || !open || !topmost || evt.key !== 'Tab' || !trapFocus) {
            return;
        }

        const focusableEls = getFocusableElements(surface);
        const activeElement = ownerDocument?.activeElement as HTMLElement | null;

        if (focusableEls.length === 0) {
            evt.preventDefault();
            surface.focus();

            return;
        }

        if (!activeElement || !surface.contains(activeElement)) {
            evt.preventDefault();
            focusWithin(surface, evt.shiftKey);

            return;
        }

        const firstFocusableEl = focusableEls[0];
        const lastFocusableEl = focusableEls.at(-1);

        if (evt.shiftKey && activeElement === firstFocusableEl) {
            evt.preventDefault();
            lastFocusableEl?.focus();
        } else if (!evt.shiftKey && activeElement === lastFocusableEl) {
            evt.preventDefault();
            firstFocusableEl?.focus();
        }
    });

    const handleFocusIn = useEffectCallback((evt: FocusEvent) => {
        const surface = surfaceRef.current;
        const nextTarget = evt.target as Node | null;

        if (!surface || !trapFocus || !open || !topmost || !nextTarget || surface.contains(nextTarget)) {
            return;
        }

        focusWithin(surface);
    });

    useEffect(() => {
        const prevOpen = openRef.current;

        if (open && !prevOpen) {
            lastActiveElRef.current = ownerDocument?.activeElement as HTMLElement | null;
        }

        openRef.current = open;
    }, [open, ownerDocument]);

    useEffect(() => {
        const fallbackTrigger = triggerRef.current as HTMLElement | null;

        return () => {
            if (!restoreFocus || openRef.current) {
                return;
            }

            restoreFocusTo(lastActiveElRef.current, fallbackTrigger);
        };
    }, [restoreFocus, triggerRef]);

    useIsomorphicLayoutEffect(() => {
        if (!open) {
            return;
        }

        const timer = setTimeout(() => {
            const surface = surfaceRef.current;

            if (!surface || !topmost) {
                return;
            }

            const activeElement = ownerDocument?.activeElement as Node | null;

            if (!activeElement || !surface.contains(activeElement)) {
                focusWithin(surface);
            }
        }, 0);

        return () => {
            clearTimeout(timer);
        };
    }, [open, ownerDocument, surfaceRef, topmost]);

    useEventListener(ownerDocument, 'keydown', handleKeyDown);
    useEventListener(ownerDocument, 'focusin', handleFocusIn);
};
