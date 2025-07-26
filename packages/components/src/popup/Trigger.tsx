import { useEffectCallback, useEventListener } from '@nild/hooks';
import { cnJoin, mergeRefs } from '@nild/shared';
import { ReactElement, isValidElement, cloneElement, Children, FC } from 'react';
import { usePopupContext } from './contexts';
import { TriggerProps } from './interfaces';
import { triggerClassNames } from './style';

const Trigger: FC<TriggerProps> = ({ children }) => {
    const { actions, refs, setOpen, enter, leave } = usePopupContext();
    const child = Children.toArray(children).find(child => isValidElement(child));
    const global = actions.has('click') || actions.has('contextMenu') ? window : null;

    const handleMouseEnter = useEffectCallback((evt: MouseEvent) => {
        child?.props?.onMouseEnter?.(evt);
        enter();
    });

    const handleMouseLeave = useEffectCallback((evt: MouseEvent) => {
        child?.props?.onMouseLeave?.(evt);
        leave();
    });

    const handleFocus = useEffectCallback((evt: FocusEvent) => {
        child?.props?.onFocus?.(evt);
        if (actions.has('focus')) {
            setOpen(true);
        }
    });

    const handleBlur = useEffectCallback((evt: FocusEvent) => {
        child?.props?.onBlur?.(evt);
        if (actions.has('focus')) {
            setOpen(false);
        }
    });

    useEventListener(global, 'click', evt => {
        const target = evt.target as Node | null;
        const inTrigger = refs.trigger.current?.contains(target);
        const inPortal = refs.portal.current?.contains(target);

        if (inTrigger) {
            actions.has('click') && setOpen(open => !open);
            actions.has('contextMenu') && setOpen(false);
        } else {
            !inPortal && setOpen(false);
        }
    });

    useEventListener(global, 'contextmenu', evt => {
        const target = evt.target as Node | null;
        const inTrigger = refs.trigger.current?.contains(target);
        const inPortal = refs.portal.current?.contains(target);

        if (inTrigger) {
            actions.has('contextMenu') && (evt.preventDefault(), setOpen(true));
        } else {
            !inPortal && setOpen(false);
        }
    });

    if (!child) return null;

    return cloneElement(child as ReactElement, {
        ...child?.props,
        className: cnJoin(triggerClassNames(), child?.props?.className),
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onFocus: handleFocus,
        onBlur: handleBlur,
        ref: mergeRefs(refs.trigger, child?.props?.ref),
    });
};

Trigger.displayName = 'Popup.Trigger';

export default Trigger;
