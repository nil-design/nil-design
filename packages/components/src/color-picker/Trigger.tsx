import { mergeRefs } from '@nild/shared';
import {
    Children,
    HTMLAttributes,
    FC,
    ReactNode,
    Ref,
    RefAttributes,
    cloneElement,
    forwardRef,
    isValidElement,
} from 'react';
import { mergeProps } from '../_shared/utils';
import { useColorPickerTriggerContext } from './contexts';
import { TriggerProps } from './interfaces';
import variants from './style';

type TriggerElementProps = HTMLAttributes<HTMLElement> & {
    'data-disabled'?: boolean;
    disabled?: boolean;
};

const TriggerImpl = forwardRef<HTMLElement, TriggerProps>((props, popupTriggerRef) => {
    const { children, ...triggerProps } = props;
    const { disabled, onKeyDown, open, rootRef, triggerRef } = useColorPickerTriggerContext();

    const child = Children.toArray(children).find(isValidElement<TriggerElementProps>);

    if (!child) {
        return null;
    }

    const nativeButton = child.type === 'button';
    const childRef = (child as { ref?: Ref<HTMLElement> }).ref;
    const userProps = mergeProps(
        triggerProps as Record<string, unknown>,
        child.props as Record<string, unknown>,
    ) as TriggerElementProps;
    const internalProps = {
        'aria-disabled': disabled || undefined,
        'aria-expanded': open,
        'aria-haspopup': 'dialog',
        className: variants.customTrigger({ open }),
        ...(nativeButton ? { disabled } : {}),
        'data-disabled': disabled || undefined,
        onKeyDown,
        ref: mergeRefs(rootRef, popupTriggerRef, childRef, triggerRef),
        role: nativeButton ? userProps.role : (userProps.role ?? 'button'),
        tabIndex: disabled ? -1 : (userProps.tabIndex ?? 0),
    } as TriggerElementProps & RefAttributes<HTMLElement>;

    return cloneElement(
        child,
        mergeProps(
            userProps as Record<string, unknown>,
            internalProps as Record<string, unknown>,
        ) as Partial<TriggerElementProps> & RefAttributes<HTMLElement>,
    );
});

const Trigger = TriggerImpl as FC<TriggerProps>;

export const isTriggerElement = (child: ReactNode) => isValidElement(child) && child.type === Trigger;

Trigger.displayName = 'ColorPicker.Trigger';

export default Trigger;
