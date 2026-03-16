import { useControllableState } from '@nild/hooks';
import { cnMerge } from '@nild/shared';
import { forwardRef, ReactElement, ChangeEvent, ReactNode, isValidElement } from 'react';
import { registerSlots } from '../_shared/utils';
import { useCompositeContext, InputProvider } from './contexts';
import { InputProps } from './interfaces';
import { isPrefixElement } from './Prefix';
import variants from './style';
import { isSuffixElement } from './Suffix';

export const isInputElement = (child: ReactNode): child is ReactElement<InputProps> => {
    return isValidElement(child) && child.type === Input;
};

const collectSlots = registerSlots({
    prefix: { isMatched: isPrefixElement },
    suffix: { isMatched: isSuffixElement },
});

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const compositeContext = useCompositeContext();

    const {
        className,
        children,
        variant = compositeContext.variant,
        size = compositeContext.size,
        block = compositeContext.block,
        disabled = compositeContext.disabled,
        type = 'text',
        value: externalValue,
        defaultValue = '',
        onChange,
        ...restProps
    } = props;
    const { slots } = collectSlots(children);
    const [value, setValue] = useControllableState<string | number>(externalValue, defaultValue);

    const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setValue(evt.target.value);
        onChange?.(evt.target.value, evt);
    };

    return (
        <InputProvider
            value={{
                size,
                disabled,
                variant,
            }}
        >
            <span
                className={cnMerge(
                    variants.inputWrapper({
                        variant,
                        size,
                        block,
                        disabled,
                    }),
                    className,
                )}
            >
                {slots.prefix.el}
                <input
                    ref={ref}
                    type={type}
                    value={value as string | number}
                    onChange={handleChange}
                    disabled={disabled}
                    className={variants.input({ size })}
                    {...restProps}
                />
                {slots.suffix.el}
            </span>
        </InputProvider>
    );
});

Input.displayName = 'Input';

export default Input;
