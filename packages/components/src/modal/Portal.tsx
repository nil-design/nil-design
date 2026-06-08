import { useEffectCallback, useEventListener, useRefState, useScrollLock } from '@nild/hooks';
import { cnMerge, mergeRefs } from '@nild/shared';
import { ReactElement, forwardRef, isValidElement, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { PortalContainerProvider } from '../_shared/contexts';
import { getOwnerDocument, registerSlots } from '../_shared/utils';
import { isBodyElement } from './Body';
import Close, { isCloseElement } from './Close';
import { useModalContext } from './contexts';
import { isFooterElement } from './Footer';
import { isHeaderElement } from './Header';
import { useModalFocusScope, useModalStack } from './hooks';
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
            updateOpen,
        } = useModalContext();
        const surfaceRef = useRef<HTMLDivElement>(null);
        const [portalContainer, setPortalContainer, portalContainerRef] = useRefState<HTMLDivElement | null>(null);
        const ownerDocument = getOwnerDocument(externalContainer, surfaceRef.current, refs.trigger.current);
        const container = externalContainer ?? ownerDocument?.body ?? null;
        const { zIndex, topmost } = useModalStack(ownerDocument, Boolean(container));
        const portalContainerContext = useMemo(
            () => ({
                container: portalContainer,
            }),
            [portalContainer],
        );

        const handleOverlayClick = useEffectCallback(() => {
            if (overlayless || !open || !closeOnOverlayClick || !topmost) {
                return;
            }

            updateOpen(false);
        });

        const handleKeyDown = useEffectCallback((evt: KeyboardEvent) => {
            if (!open || !topmost) {
                return;
            }

            if (evt.key === 'Escape' && closeOnEscape) {
                evt.preventDefault();
                updateOpen(false);
            }
        });

        useScrollLock(ownerDocument, lockScroll && Boolean(container));

        useModalFocusScope({
            open,
            trapFocus,
            restoreFocus,
            topmost,
            ownerDocument,
            portalContainerRef,
            surfaceRef,
            triggerRef: refs.trigger,
        });
        useEventListener(ownerDocument, 'keydown', handleKeyDown);

        if (!container) {
            return null;
        }

        const { slots } = collectSlots(children);

        return createPortal(
            <PortalContainerProvider value={portalContainerContext}>
                <div
                    ref={setPortalContainer}
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
                        ref={mergeRefs(surfaceRef, ref)}
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
                </div>
            </PortalContainerProvider>,
            container,
        );
    },
);

Portal.displayName = 'Modal.Portal';

export default Portal;
