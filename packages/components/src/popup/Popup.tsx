import { useControllableState, useEffectCallback, useIsomorphicLayoutEffect, useTimeout } from '@nild/hooks';
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
    /** keep hover and focus from closing each other. */
    const openSourcesRef = useRef({ focus: false, hover: false });
    const [enterDelay, leaveDelay = 100] = isArray(delay) ? delay : [delay, delay];
    const actions = useMemo(() => new Set(makeArray(action)), [action]);
    const [{ triggerRef, portalRef, portalContext, arrowRef, arrowContext }, { update, autoUpdate }] = usePopup({
        arrowed,
        placement,
        offset,
    });

    const portalMounted = mounted || open;

    const updateOpen = useEffectCallback((action: SetStateAction<boolean>) => {
        if (disabled) return;

        const nextOpen = isFunction(action) ? action(open) : action;

        if (Object.is(open, nextOpen)) return;

        if (!nextOpen) {
            openSourcesRef.current.focus = false;
            openSourcesRef.current.hover = false;
        }

        setOpen(nextOpen);
        (nextOpen ? onOpen : onClose)?.();
    });

    const closeOpenSource = useEffectCallback((source: 'focus' | 'hover') => {
        openSourcesRef.current[source] = false;

        if (!openSourcesRef.current.focus && !openSourcesRef.current.hover) {
            updateOpen(false);
        }
    });

    const handleFocus = useEffectCallback(() => {
        openSourcesRef.current.focus = true;
        updateOpen(true);
    });

    const handleBlur = useEffectCallback(() => {
        closeOpenSource('focus');
    });

    const enterTimeout = useTimeout(() => {
        openSourcesRef.current.hover && updateOpen(true);
    }, enterDelay);
    const leaveTimeout = useTimeout(() => closeOpenSource('hover'), leaveDelay);

    const handleMouseEnter = useEffectCallback(() => {
        if (actions.has('hover')) {
            openSourcesRef.current.hover = true;
            leaveTimeout.cancel();
            enterTimeout.run();
        }
    });

    const handleMouseLeave = useEffectCallback(() => {
        if (actions.has('hover')) {
            openSourcesRef.current.hover = false;
            enterTimeout.cancel();
            leaveTimeout.run();
        }
    });

    const refs = useMemo(
        () => ({
            trigger: triggerRef,
            portal: portalRef,
            arrow: arrowRef,
        }),
        [arrowRef, portalRef, triggerRef],
    );

    const context = useMemo(
        () => ({
            actions,
            size,
            arrowed,
            inverse,
            refs,
            setOpen: updateOpen,
            enter: handleMouseEnter,
            leave: handleMouseLeave,
            focus: handleFocus,
            blur: handleBlur,
        }),
        [
            actions,
            size,
            arrowed,
            inverse,
            refs,
            updateOpen,
            handleMouseEnter,
            handleMouseLeave,
            handleFocus,
            handleBlur,
        ],
    );

    useIsomorphicLayoutEffect(() => {
        if (open && !mounted) {
            setMounted(true);
        }

        if (open && triggerRef.current && portalRef.current) {
            return autoUpdate(triggerRef.current, portalRef.current, update);
        }
    }, [autoUpdate, mounted, open, portalRef, triggerRef, update]);

    return (
        <PopupProvider value={context}>
            {slots.trigger.el ?? (slots.firstBare.el && <Trigger>{slots.firstBare.el}</Trigger>)}
            <PortalProvider value={portalContext}>
                <ArrowProvider value={arrowContext}>
                    {slots.portal.el && <Transition visible={open}>{portalMounted && slots.portal.el}</Transition>}
                </ArrowProvider>
            </PortalProvider>
        </PopupProvider>
    );
};

Popup.displayName = 'Popup';

export default Popup;
