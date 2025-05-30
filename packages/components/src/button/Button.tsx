import { isArray } from 'lodash-es';
import {
    ReactNode,
    ButtonHTMLAttributes,
    forwardRef,
    ForwardRefExoticComponent,
    RefAttributes,
    ReactElement,
} from 'react';
import { DISABLED_CLS } from '../_core/style';
import { cn, isEmptyChildren, isPlainChildren } from '../_core/utils';
import {
    ButtonVariant,
    ButtonSize,
    ButtonShape,
    VARIANT_CLS_MAP,
    SIZE_CLS_MAP,
    SHAPE_CLS_MAP,
    EQUAL_CLS_MAP,
    GROUP_FIRST_CLS_MAP,
    GROUP_LAST_CLS_MAP,
    GROUP_DIVIDER_CLS_MAP,
} from './style';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    children?: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    shape?: ButtonShape;
    equal?: boolean;
    disabled?: boolean;
    block?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            children,
            variant = 'solid',
            size = 'medium',
            shape = 'square',
            equal = false,
            disabled,
            block,
            ...restProps
        },
        ref,
    ) => {
        const plain = isPlainChildren(children);

        return (
            <button
                type="button"
                {...restProps}
                disabled={disabled}
                className={cn(
                    ['nd-button', 'font-sans', 'cursor-pointer', 'transition-colors'],
                    block && ['w-full'],
                    VARIANT_CLS_MAP[variant],
                    SIZE_CLS_MAP[size][`${plain}`],
                    SHAPE_CLS_MAP[shape],
                    equal && EQUAL_CLS_MAP[size],
                    DISABLED_CLS,
                    className,
                )}
                ref={ref}
            >
                {children}
            </button>
        );
    },
) as ForwardRefExoticComponent<ButtonProps & RefAttributes<HTMLButtonElement>> & {
    Group: typeof ButtonGroup;
};

Button.displayName = 'Button';

export interface ButtonGroupProps extends Pick<ButtonProps, 'variant' | 'size' | 'disabled'> {
    className?: string;
    children?: ReactElement<ButtonProps> | ReactElement<ButtonProps>[];
    direction?: 'horizontal' | 'vertical';
}

const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
    ({ children, className, variant = 'solid', size = 'medium', disabled, direction = 'horizontal' }, ref) => {
        if (!children || isEmptyChildren(children)) {
            return <></>;
        }

        if (!isArray(children)) {
            return <Button {...children.props} {...{ variant, size, disabled }} />;
        }

        const horizontal = direction === 'horizontal';

        return (
            <div className={cn('nd-button-group', 'flex', !horizontal && 'flex-col', className)} ref={ref}>
                {children.map((child, index) => (
                    <Button
                        key={index}
                        {...child.props}
                        className={cn([
                            index === 0
                                ? GROUP_FIRST_CLS_MAP[direction]
                                : index === children.length - 1
                                  ? GROUP_LAST_CLS_MAP[direction]
                                  : 'rounded-none',
                            index !== 0 && (horizontal ? 'border-l-0' : 'border-t-0'),
                            index !== children.length - 1 && GROUP_DIVIDER_CLS_MAP[direction][variant],
                        ])}
                        {...{ variant, size, disabled }}
                    />
                ))}
            </div>
        );
    },
);

ButtonGroup.displayName = 'Button.Group';

Button.Group = ButtonGroup;

export default Button;
