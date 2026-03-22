import { useEffectCallback, useEventListener, useIsomorphicLayoutEffect } from '@nild/hooks';
import { cnMerge, mergeRefs } from '@nild/shared';
import { ReactElement, forwardRef, useEffect, isValidElement, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getOwnerDocument, lockDocumentScroll, registerSlots } from '../_shared/utils';
import { focusWithin, getFocusableElements, restoreFocusTo } from './_shared';
import { isBodyElement } from './Body';
import Close, { isCloseElement } from './Close';
import { useModalContext } from './contexts';
import { isFooterElement } from './Footer';
import { isHeaderElement } from './Header';
import { useModalStack } from './hooks';
import { PortalProps } from './interfaces';
import variants from './style';

export const isPortalElement = (child: unknown): child is ReactElement<PortalProps> => {
    return isValidElement(child) && child.type === Portal;
};

const collectSlots = registerSlots({
    header: { isMatched: child => isHeaderElement(child) },
    body: { isMatched: child => isBodyElement(child) },
    footer: { isMatched: child => isFooterElement(child) },
    close: { isMatched: child => isCloseElement(child) },
});

const Portal = forwardRef<HTMLDivElement, PortalProps>(
    (
        {
            className,
            style,
            children,
            container: externalContainer,
            overlayless = false,
            overlayClassName,
            surfaceClassName,
            onTransitionEnd,
            ...restProps
        },
        ref,
    ) => {
        const {
            open,
            variant,
            placement,
            size,
            closeOnEscape,
            closeOnOverlayClick,
            trapFocus,
            lockScroll,
            restoreFocus,
            accessibility,
            refs,
            close,
        } = useModalContext();
        const openRef = useRef(open);
        const ownerDocument = getOwnerDocument(externalContainer, refs.surface.current, refs.trigger.current);
        const container = externalContainer ?? ownerDocument?.body ?? null;
        const { zIndex, topmost } = useModalStack(ownerDocument, Boolean(container));

        openRef.current = open;

        const handleOverlayClick = useEffectCallback(() => {
            if (overlayless || !open || !closeOnOverlayClick || !topmost) {
                return;
            }

            close();
        });

        const handleKeyDown = useEffectCallback((evt: KeyboardEvent) => {
            const surface = refs.surface.current;

            if (!surface || !open || !topmost) {
                return;
            }

            if (evt.key === 'Escape' && closeOnEscape) {
                evt.preventDefault();
                close();

                return;
            }

            if (evt.key !== 'Tab' || !trapFocus) {
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
            const surface = refs.surface.current;
            const nextTarget = evt.target as Node | null;

            if (!surface || !trapFocus || !open || !topmost || !nextTarget || surface.contains(nextTarget)) {
                return;
            }

            focusWithin(surface);
        });

        useEffect(() => {
            if (!container || !lockScroll || !ownerDocument) {
                return;
            }

            return lockDocumentScroll(ownerDocument);
        }, [lockScroll, ownerDocument, container]);

        useEffect(() => {
            return () => {
                if (!restoreFocus || openRef.current) {
                    return;
                }

                restoreFocusTo(refs.lastActiveEl.current, refs.trigger.current as HTMLElement | null);
            };
        }, [refs.lastActiveEl, refs.trigger, restoreFocus]);

        useIsomorphicLayoutEffect(() => {
            if (!open) {
                return;
            }

            const timer = setTimeout(() => {
                const surface = refs.surface.current;

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
        }, [open, ownerDocument, refs.surface, topmost]);

        useEventListener(ownerDocument, 'keydown', handleKeyDown);
        useEventListener(ownerDocument, 'focusin', handleFocusIn);

        if (!container) {
            return null;
        }

        const { slots } = collectSlots(children);

        return createPortal(
            <div
                className={cnMerge(variants.portal({ placement }), className)}
                style={{
                    zIndex,
                    ...style,
                }}
                {...restProps}
            >
                {!overlayless && (
                    <div className={cnMerge(variants.overlay(), overlayClassName)} onClick={handleOverlayClick} />
                )}
                <div
                    ref={mergeRefs(refs.surface, ref)}
                    className={cnMerge(variants.surface({ variant, placement, size }), surfaceClassName)}
                    aria-describedby={accessibility['aria-describedby']}
                    aria-label={accessibility['aria-label']}
                    aria-labelledby={accessibility['aria-labelledby']}
                    aria-modal="true"
                    role="dialog"
                    tabIndex={-1}
                    onTransitionEnd={onTransitionEnd}
                >
                    {slots.header.el}
                    {slots.body.el}
                    {slots.footer.el}
                    {slots.close.el ?? <Close />}
                </div>
            </div>,
            container,
        );
    },
);

Portal.displayName = 'Modal.Portal';

export default Portal;
