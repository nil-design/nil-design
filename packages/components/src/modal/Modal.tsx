import { useControllableState, useEffectCallback } from '@nild/hooks';
import { cnJoin, isFunction } from '@nild/shared';
import { cloneElement, Dispatch, FC, SetStateAction, useMemo, useRef } from 'react';
import { registerSlots } from '../_shared/utils';
import Transition, { TransitionStatus } from '../transition';
import { resolvePlacement } from './_shared';
import { ModalProvider } from './contexts';
import { ModalProps } from './interfaces';
import { isPortalElement } from './Portal';
import variants from './style';
import Trigger, { isTriggerElement } from './Trigger';

const collectSlots = registerSlots({
    trigger: { isMatched: child => isTriggerElement(child) },
    portal: { isMatched: child => isPortalElement(child) },
    firstBare: {
        isMatched: child => !isTriggerElement(child) && !isPortalElement(child),
        strategy: 'first',
    },
});

const Modal: FC<ModalProps> = props => {
    const {
        children,
        variant = 'dialog',
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
    } = props;
    const { slots } = collectSlots(children);
    const [open, setOpen] = useControllableState(externalOpen, defaultOpen);
    const openRef = useRef(open);
    const triggerRef = useRef<Element>(null);
    const placement = resolvePlacement(variant, props.placement);

    openRef.current = open;

    const updateOpen = useEffectCallback<Dispatch<SetStateAction<boolean>>>(action => {
        if (disabled) {
            return;
        }

        const currentOpen = openRef.current;
        const nextOpen = isFunction(action) ? action(currentOpen) : action;

        if (nextOpen === currentOpen) {
            return;
        }

        openRef.current = nextOpen;
        setOpen(nextOpen);

        if (nextOpen) {
            onOpen?.();
        } else {
            onClose?.();
        }
    });

    const context = useMemo(
        () => ({
            open,
            variant,
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
            },
            updateOpen,
        }),
        [
            ariaDescribedBy,
            ariaLabel,
            ariaLabelledBy,
            closeOnEscape,
            closeOnOverlayClick,
            disabled,
            lockScroll,
            open,
            placement,
            updateOpen,
            restoreFocus,
            size,
            trapFocus,
            variant,
        ],
    );

    return (
        <ModalProvider value={context}>
            {slots.trigger.el ?? (slots.firstBare.el && <Trigger>{slots.firstBare.el}</Trigger>)}
            {slots.portal.el && (
                <Transition visible={open}>
                    {(status: TransitionStatus) => {
                        if (!open && [TransitionStatus.UNMOUNTED, TransitionStatus.EXITED].includes(status)) {
                            return null;
                        }

                        return cloneElement(slots.portal.el!, {
                            ...slots.portal.el!.props,
                            overlayClassName: cnJoin(
                                variants.overlayMotion({ status }),
                                slots.portal.el!.props.overlayClassName,
                            ),
                            surfaceClassName: cnJoin(
                                variants.surfaceMotion({ status, variant, placement }),
                                slots.portal.el!.props.surfaceClassName,
                            ),
                        });
                    }}
                </Transition>
            )}
        </ModalProvider>
    );
};

Modal.displayName = 'Modal';

export default Modal;
