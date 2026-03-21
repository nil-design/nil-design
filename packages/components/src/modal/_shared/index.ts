import { ModalPlacement, ModalVariant } from '../interfaces';

export const resolvePlacement = (variant: ModalVariant, placement?: ModalPlacement): ModalPlacement => {
    if (variant === 'drawer') {
        return placement && placement !== 'center' ? placement : 'right';
    }

    return 'center';
};

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
    const style = window.getComputedStyle(element);

    return style.display !== 'none' && style.visibility !== 'hidden' && !element.hidden;
};

export const getFocusableElements = (container: HTMLElement) => {
    return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors)).filter(element => {
        return (
            !element.hasAttribute('disabled') &&
            element.getAttribute('aria-hidden') !== 'true' &&
            element.tabIndex >= 0 &&
            isElementVisible(element)
        );
    });
};

export const focusWithin = (container: HTMLElement, fromEnd = false) => {
    const focusableEls = getFocusableElements(container);
    const focusableEl = focusableEls.at(fromEnd ? -1 : 0) ?? container;

    focusableEl.focus();

    return focusableEl;
};

export const restoreFocusTo = (target?: HTMLElement | null, fallback?: HTMLElement | null) => {
    const resolvedTarget = target?.isConnected ? target : fallback?.isConnected ? fallback : null;

    resolvedTarget?.focus?.();
};
