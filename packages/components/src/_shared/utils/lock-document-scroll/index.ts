import { isBrowser } from '@nild/shared';

let scrollLockCount = 0;
let bodyOverflow = '';
let bodyPaddingRight = '';

const hasStableScrollbarGutter = (doc: Document) => {
    const view = doc.defaultView ?? (isBrowser() ? window : null);

    if (!view) {
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

const lockDocumentScroll = (doc: Document) => {
    if (!isBrowser()) {
        return () => undefined;
    }

    if (scrollLockCount === 0) {
        bodyOverflow = doc.body.style.overflow;
        bodyPaddingRight = doc.body.style.paddingRight;

        const computedPaddingRight = Number.parseFloat(window.getComputedStyle(doc.body).paddingRight || '0') || 0;
        const scrollbarWidth =
            doc.documentElement.clientWidth > 0 ? window.innerWidth - doc.documentElement.clientWidth : 0;
        const requiresPaddingCompensation = !hasStableScrollbarGutter(doc);

        doc.body.style.overflow = 'hidden';

        if (requiresPaddingCompensation && scrollbarWidth > 0) {
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

export default lockDocumentScroll;
