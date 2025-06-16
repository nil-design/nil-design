import { useStableCallback } from '@nild/hooks';
import { cnJoin, mergeRefs } from '@nild/shared/utils';
import { ReactNode, ReactElement, forwardRef, isValidElement, cloneElement, Children } from 'react';

export type TriggerAction = 'click' | 'hover' | 'focus' | 'contextMenu';

export interface TriggerProps {
    children?: ReactNode;
    action?: TriggerAction | TriggerAction[];
    onToggle?: () => void;
    onOpen?: () => void;
    onClose?: () => void;
}

const Trigger = forwardRef<Element, TriggerProps>(
    ({ children, action = 'click', onToggle, onOpen, onClose, ...restProps }, ref) => {
        const child = Children.toArray(children).find(child => isValidElement(child));
        const actions = Array.isArray(action) ? action : [action];
        const handleClick = useStableCallback(() => actions.includes('click') && onToggle?.());
        const handleMouseEnter = useStableCallback(() => actions.includes('hover') && onOpen?.());
        const handleMouseLeave = useStableCallback(() => actions.includes('hover') && onClose?.());
        const handleFocus = useStableCallback(() => actions.includes('focus') && onOpen?.());
        const handleBlur = useStableCallback(
            () =>
                (actions.includes('click') || actions.includes('focus') || actions.includes('contextMenu')) &&
                onClose?.(),
        );
        const handleContextMenu = useStableCallback(
            (evt: MouseEvent) => actions.includes('contextMenu') && (evt.preventDefault(), onOpen?.()),
        );

        if (!child) return null;

        return cloneElement(child as ReactElement, {
            ...restProps,
            className: cnJoin('nd-trigger', child?.props?.className),
            ref: mergeRefs(ref, child?.props?.ref),
            onClick: handleClick,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onFocus: handleFocus,
            onBlur: handleBlur,
            onContextMenu: handleContextMenu,
        });
    },
);

Trigger.displayName = 'Trigger';

export default Trigger;
