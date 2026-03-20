import { isBrowser } from '@nild/shared';

export const MODAL_TRANSITION_DURATION = 200;

const modalStack: number[] = [];
const modalStackListeners = new Set<VoidFunction>();

let modalIdSeed = 0;
let scrollLockCount = 0;
let bodyOverflow = '';
let bodyPaddingRight = '';

const emitModalStack = () => {
    modalStackListeners.forEach(listener => {
        listener();
    });
};

export const createModalId = () => {
    modalIdSeed += 1;

    return modalIdSeed;
};

export const addModalToStack = (id: number) => {
    if (modalStack.includes(id)) {
        return;
    }

    modalStack.push(id);
    emitModalStack();
};

export const removeModalFromStack = (id: number) => {
    const index = modalStack.indexOf(id);

    if (index === -1) {
        return;
    }

    modalStack.splice(index, 1);
    emitModalStack();
};

export const isTopModal = (id: number) => {
    return modalStack.at(-1) === id;
};

export const getModalStackIndex = (id: number) => {
    return modalStack.indexOf(id);
};

export const subscribeModalStack = (listener: VoidFunction) => {
    modalStackListeners.add(listener);

    return () => {
        modalStackListeners.delete(listener);
    };
};

export const resolveDocument = (
    container?: Element | DocumentFragment | null,
    ...nodes: Array<Node | null | undefined>
): Document | null => {
    const ownerDocument =
        ('ownerDocument' in (container || {}) && container?.ownerDocument) ||
        nodes.find(node => node?.ownerDocument)?.ownerDocument;

    if (ownerDocument) {
        return ownerDocument;
    }

    return isBrowser() ? document : null;
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
    const focusables = getFocusableElements(container);
    const target = focusables.at(fromEnd ? -1 : 0) ?? container;

    target.focus();

    return target;
};

export const restoreFocusTo = (target?: HTMLElement | null, fallback?: HTMLElement | null) => {
    const resolvedTarget = target?.isConnected ? target : fallback?.isConnected ? fallback : null;

    resolvedTarget?.focus?.();
};

export const lockDocumentScroll = (doc: Document) => {
    if (!isBrowser()) {
        return () => undefined;
    }

    if (scrollLockCount === 0) {
        bodyOverflow = doc.body.style.overflow;
        bodyPaddingRight = doc.body.style.paddingRight;

        const computedPaddingRight = Number.parseFloat(window.getComputedStyle(doc.body).paddingRight || '0') || 0;
        const scrollbarWidth =
            doc.documentElement.clientWidth > 0 ? window.innerWidth - doc.documentElement.clientWidth : 0;

        doc.body.style.overflow = 'hidden';

        if (scrollbarWidth > 0) {
            doc.body.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;
        }
    }

    scrollLockCount += 1;

    return () => {
        scrollLockCount = Math.max(0, scrollLockCount - 1);

        if (scrollLockCount === 0) {
            doc.body.style.overflow = bodyOverflow;
            doc.body.style.paddingRight = bodyPaddingRight;
        }
    };
};
