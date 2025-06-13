import { useStableCallback } from '@nild/hooks';
import { cnJoin, mergeRefs } from '@nild/shared/utils';
import { ReactNode, ReactElement, forwardRef, isValidElement, cloneElement } from 'react';

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
        const child = Array.isArray(children) ? children[0] : children;
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

        if (!child || !isValidElement(child)) return null;

        const firstChild = child as ReactElement;

        return cloneElement(firstChild, {
            ...restProps,
            className: cnJoin('nd-trigger', firstChild?.props?.className),
            ref: mergeRefs(ref, firstChild?.props?.ref),
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
