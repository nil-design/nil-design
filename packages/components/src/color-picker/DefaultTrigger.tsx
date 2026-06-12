import { cnMerge, mergeRefs } from '@nild/shared';
import {
    ButtonHTMLAttributes,
    Children,
    HTMLAttributes,
    KeyboardEvent,
    ReactElement,
    Ref,
    RefAttributes,
    RefObject,
    cloneElement,
    forwardRef,
    isValidElement,
} from 'react';
import { mergeHandlers } from '../_shared/utils';
import { ColorPickerSize } from './interfaces';
import variants from './style';
import Swatch from './Swatch';

type TriggerElementProps = HTMLAttributes<HTMLElement> & {
    'data-disabled'?: boolean;
    disabled?: boolean;
};

type TriggerElement = ReactElement<TriggerElementProps & RefAttributes<HTMLElement>> & {
    ref?: Ref<HTMLElement>;
};

interface DefaultTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    colorCss: string;
    customTrigger?: ReactElement<{ children?: ReactElement }> | null;
    disabled?: boolean;
    open?: boolean;
    size?: ColorPickerSize;
    triggerRef: RefObject<HTMLElement | null>;
}

const DefaultTrigger = forwardRef<HTMLButtonElement, DefaultTriggerProps>((props, ref) => {
    const {
        className,
        colorCss,
        customTrigger,
        disabled = false,
        open = false,
        size = 'medium',
        triggerRef,
        'aria-label': ariaLabel,
        onKeyDown,
        ...restProps
    } = props;
    const defaultAriaLabel = ariaLabel ?? 'Select color';

    if (customTrigger) {
        const child = Children.toArray(customTrigger.props.children).find(isValidElement) as TriggerElement | undefined;

        if (child) {
            const nativeButton = child.type === 'button';

            return cloneElement(child, {
                ...restProps,
                ...child.props,
                'aria-disabled': disabled || undefined,
                'aria-expanded': open,
                'aria-haspopup': 'dialog',
                'aria-label': ariaLabel ?? child.props['aria-label'],
                className: cnMerge(variants.customTrigger({ open }), className, child.props.className),
                ...(nativeButton ? { disabled } : {}),
                'data-disabled': disabled || undefined,
                onKeyDown: mergeHandlers(child.props.onKeyDown, onKeyDown as (evt: KeyboardEvent<HTMLElement>) => void),
                ref: mergeRefs(ref as Ref<HTMLElement>, child.ref, triggerRef),
                role: nativeButton ? child.props.role : (child.props.role ?? 'button'),
                tabIndex: disabled ? -1 : (child.props.tabIndex ?? 0),
            } as Partial<TriggerElementProps> & RefAttributes<HTMLElement>);
        }
    }

    return (
        <button
            {...restProps}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-label={defaultAriaLabel}
            className={cnMerge(variants.trigger({ size, disabled, open }), className)}
            data-disabled={disabled || undefined}
            disabled={disabled}
            onKeyDown={onKeyDown}
            ref={mergeRefs(ref, triggerRef as Ref<HTMLButtonElement>)}
            type="button"
        >
            <Swatch css={colorCss} />
        </button>
    );
});

DefaultTrigger.displayName = 'ColorPicker.DefaultTrigger';

export default DefaultTrigger;
