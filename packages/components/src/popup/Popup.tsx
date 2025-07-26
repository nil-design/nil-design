import { useControllableState, useEffectCallback, useIsomorphicLayoutEffect } from '@nild/hooks';
import { isArray, isFunction, makeArray } from '@nild/shared';
import { ReactElement, Children, isValidElement, FC, useState, SetStateAction, useRef, useMemo } from 'react';
import Transition from '../transition';
import { ArrowProvider, PopupProvider, PortalProvider } from './contexts';
import { usePopup } from './hooks';
import { PopupProps } from './interfaces';
import Portal from './Portal';
import Trigger from './Trigger';

const Popup: FC<PopupProps> = ({
    children,
    placement,
    offset,
    action = 'click',
    arrowed = true,
    size = 'medium',
    delay = 100,
    open: externalOpen,
    defaultOpen = false,
    disabled,
    onOpen,
    onClose,
}) => {
    let firstBareChild: ReactElement | undefined;
    let triggerChild: ReactElement | undefined;
    let portalChild: ReactElement | undefined;

    Children.forEach(children, child => {
        if (isValidElement(child)) {
            switch (child.type) {
                case Trigger:
                    triggerChild = child;
                    break;
                case Portal:
                    portalChild = child;
                    break;
                default:
                    firstBareChild = child;
                    break;
            }
        }
    });

    const [mounted, setMounted] = useState(defaultOpen);
    const [open, setOpen] = useControllableState(externalOpen, defaultOpen);
    const [enterDelay, leaveDelay = 100] = isArray(delay) ? delay : [delay, delay];
    const actions = useMemo(() => new Set(makeArray(action)), [action]);
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const [{ triggerRef, portalRef, portalContext, arrowRef, arrowContext }, { update, autoUpdate }] = usePopup({
        placement,
        offset,
    });

    const updateOpen = useEffectCallback((action: SetStateAction<boolean>) => {
        if (disabled) return;
        setOpen(prevOpen => {
            const nextOpen = isFunction(action) ? action(prevOpen) : action;
            if (nextOpen) {
                onOpen?.();
            } else {
                onClose?.();
            }

            return nextOpen;
        });
    });

    const handleMouseEnter = useEffectCallback(() => {
        if (actions.has('hover')) {
            hoverTimeoutRef.current && clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = setTimeout(() => {
                updateOpen(true);
            }, enterDelay);
        }
    });

    const handleMouseLeave = useEffectCallback(() => {
        if (actions.has('hover')) {
            hoverTimeoutRef.current && clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = setTimeout(() => {
                updateOpen(false);
            }, leaveDelay);
        }
    });

    useIsomorphicLayoutEffect(() => {
        if (open && !mounted) {
            setMounted(true);
        } else if (open && mounted) {
            if (triggerRef.current && portalRef.current) {
                return autoUpdate(triggerRef.current, portalRef.current, update);
            }
        }
    }, [open, mounted]);

    return (
        <PopupProvider
            value={{
                actions,
                arrowed,
                size,
                refs: {
                    trigger: triggerRef,
                    portal: portalRef,
                    arrow: arrowRef,
                },
                setOpen: updateOpen,
                enter: handleMouseEnter,
                leave: handleMouseLeave,
            }}
        >
            {triggerChild ? triggerChild : firstBareChild && <Trigger>{firstBareChild}</Trigger>}
            <PortalProvider value={portalContext}>
                <ArrowProvider value={arrowContext}>
                    {portalChild && <Transition visible={open}>{mounted && portalChild}</Transition>}
                </ArrowProvider>
            </PortalProvider>
        </PopupProvider>
    );
};

Popup.displayName = 'Popup';

export default Popup;
