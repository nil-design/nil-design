import { useControllableState, useEffectCallback, useIsomorphicLayoutEffect } from '@nild/hooks';
import { isArray, isFunction, makeArray } from '@nild/shared';
import { FC, SetStateAction, useMemo, useRef, useState } from 'react';
import { registerSlots } from '../_shared/utils';
import Transition from '../transition';
import { ArrowProvider, PopupProvider, PortalProvider } from './contexts';
import { usePopup } from './hooks';
import { PopupProps } from './interfaces';
import Portal from './Portal';
import Trigger from './Trigger';

const collectSlots = registerSlots({
    trigger: { isMatched: child => child.type === Trigger },
    portal: { isMatched: child => child.type === Portal },
    firstBare: {
        isMatched: child => child.type !== Trigger && child.type !== Portal,
        strategy: 'first',
    },
});

const Popup: FC<PopupProps> = ({
    children,
    placement,
    offset,
    action = 'click',
    size = 'medium',
    arrowed = true,
    inverse = false,
    delay = 100,
    open: externalOpen,
    defaultOpen = false,
    disabled,
    onOpen,
    onClose,
}) => {
    const { slots } = collectSlots(children);
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

    const context = useMemo(
        () => ({
            actions,
            size,
            arrowed,
            inverse,
            refs: {
                trigger: triggerRef,
                portal: portalRef,
                arrow: arrowRef,
            },
            setOpen: updateOpen,
            enter: handleMouseEnter,
            leave: handleMouseLeave,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [actions, size, arrowed, inverse],
    );

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
        <PopupProvider value={context}>
            {slots.trigger.el ?? (slots.firstBare.el && <Trigger>{slots.firstBare.el}</Trigger>)}
            <PortalProvider value={portalContext}>
                <ArrowProvider value={arrowContext}>
                    {slots.portal.el && <Transition visible={open}>{mounted && slots.portal.el}</Transition>}
                </ArrowProvider>
            </PortalProvider>
        </PopupProvider>
    );
};

Popup.displayName = 'Popup';

export default Popup;
