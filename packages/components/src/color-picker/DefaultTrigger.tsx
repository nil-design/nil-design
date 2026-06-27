import { cnMerge, mergeRefs } from '@nild/shared';
import { ButtonHTMLAttributes, Ref, forwardRef } from 'react';
import { mergeHandlers } from '../_shared/utils';
import { useColorPickerTriggerContext } from './contexts';
import { ColorPickerSize } from './interfaces';
import variants from './style';
import Swatch from './Swatch';

interface DefaultTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    colorCss: string;
    size?: ColorPickerSize;
}

const DefaultTrigger = forwardRef<HTMLButtonElement, DefaultTriggerProps>((props, popupTriggerRef) => {
    const { className, colorCss, size = 'medium', 'aria-label': ariaLabel, onKeyDown, ...restProps } = props;
    const { disabled, onKeyDown: onInternalKeyDown, open, rootRef, triggerRef } = useColorPickerTriggerContext();
    const defaultAriaLabel = ariaLabel ?? 'Select color';

    return (
        <button
            {...restProps}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-label={defaultAriaLabel}
            className={cnMerge(variants.trigger({ size, disabled, open }), className)}
            data-disabled={disabled || undefined}
            disabled={disabled}
            onKeyDown={mergeHandlers(onKeyDown, onInternalKeyDown)}
            ref={mergeRefs(rootRef as Ref<HTMLButtonElement>, popupTriggerRef, triggerRef as Ref<HTMLButtonElement>)}
            type="button"
        >
            <Swatch css={colorCss} />
        </button>
    );
});

DefaultTrigger.displayName = 'ColorPicker.DefaultTrigger';

export default DefaultTrigger;
