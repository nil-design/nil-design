import { useControllableState, useEffectCallback } from '@nild/hooks';
import { isFunction } from '@nild/shared';
import { Dispatch, FC, SetStateAction, useEffect, useMemo, useRef } from 'react';
import { registerSlots } from '../_shared/utils';
import { ModalProvider } from './contexts';
import { ModalProps } from './interfaces';
import { createModalId, MODAL_TRANSITION_DURATION, resolveDocument, restoreFocusTo } from './internals';
import { isPortalElement } from './Portal';
import Trigger, { isTriggerElement } from './Trigger';

const collectSlots = registerSlots({
    trigger: { isMatched: child => isTriggerElement(child) },
    portal: { isMatched: child => isPortalElement(child) },
    firstBare: {
        isMatched: child => !isTriggerElement(child) && !isPortalElement(child),
        strategy: 'first',
    },
});

const Modal: FC<ModalProps> = ({
    children,
    placement = 'center',
    size = 'medium',
    open: externalOpen,
    defaultOpen = false,
    disabled = false,
    closeOnEscape = true,
    closeOnOverlayClick = true,
    trapFocus = true,
    restoreFocus = true,
    lockScroll = true,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    onOpen,
    onClose,
}) => {
    const { slots } = collectSlots(children);
    const [open, setOpen] = useControllableState(externalOpen, defaultOpen);
    const triggerRef = useRef<Element>(null);
    const surfaceRef = useRef<HTMLDivElement>(null);
    const modalIdRef = useRef(createModalId());
    const lastActiveElementRef = useRef<HTMLElement | null>(null);
    const previousOpenRef = useRef(open);

    const requestOpen = useEffectCallback<Dispatch<SetStateAction<boolean>>>(action => {
        if (disabled) {
            return;
        }

        setOpen(previousOpen => {
            const nextOpen = isFunction(action) ? action(previousOpen) : action;

            if (nextOpen === previousOpen) {
                return previousOpen;
            }

            if (nextOpen) {
                onOpen?.();
            } else {
                onClose?.();
            }

            return nextOpen;
        });
    });

    const close = useEffectCallback(() => {
        requestOpen(false);
    });

    useEffect(() => {
        const ownerDocument = resolveDocument(null, triggerRef.current, surfaceRef.current);
        let timer: ReturnType<typeof setTimeout> | undefined;

        if (open && !previousOpenRef.current) {
            lastActiveElementRef.current = ownerDocument?.activeElement as HTMLElement | null;
        }

        if (!open && previousOpenRef.current && restoreFocus) {
            timer = setTimeout(() => {
                restoreFocusTo(lastActiveElementRef.current, triggerRef.current as HTMLElement | null);
            }, MODAL_TRANSITION_DURATION);
        }

        previousOpenRef.current = open;

        return () => {
            timer && clearTimeout(timer);
        };
    }, [open, restoreFocus]);

    const context = useMemo(
        () => ({
            id: modalIdRef.current,
            open,
            placement,
            size,
            disabled,
            closeOnEscape,
            closeOnOverlayClick,
            trapFocus,
            restoreFocus,
            lockScroll,
            accessibility: {
                'aria-label': ariaLabel,
                'aria-labelledby': ariaLabelledBy,
                'aria-describedby': ariaDescribedBy,
            },
            refs: {
                trigger: triggerRef,
                surface: surfaceRef,
            },
            requestOpen,
            close,
        }),
        [
            ariaDescribedBy,
            ariaLabel,
            ariaLabelledBy,
            close,
            closeOnEscape,
            closeOnOverlayClick,
            disabled,
            lockScroll,
            open,
            placement,
            requestOpen,
            restoreFocus,
            size,
            trapFocus,
        ],
    );

    return (
        <ModalProvider value={context}>
            {slots.trigger.el ?? (slots.firstBare.el && <Trigger>{slots.firstBare.el}</Trigger>)}
            {slots.portal.el}
        </ModalProvider>
    );
};

Modal.displayName = 'Modal';

export default Modal;
