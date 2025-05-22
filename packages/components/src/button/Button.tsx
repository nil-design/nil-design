import clsx from 'clsx';
import {
    ReactNode,
    ButtonHTMLAttributes,
    forwardRef,
    ForwardRefExoticComponent,
    RefAttributes,
    ReactElement,
} from 'react';
import { disabledClassNames } from '../__core__/style';
import {
    ButtonVariant,
    ButtonSize,
    variantClassNames,
    sizeClassNames,
    groupFirstClassNames,
    groupLastClassNames,
    groupDividerClassNames,
} from './style';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    children?: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    block?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, variant = 'solid', size = 'medium', disabled, block, ...restProps }, ref) => {
        return (
            <button
                type="button"
                {...restProps}
                disabled={disabled}
                className={clsx(
                    ['nd-button', 'nd-font-sans', 'nd-cursor-pointer', 'nd-rounded', 'nd-transition-colors'],
                    block && ['nd-w-full'],
                    variantClassNames[variant],
                    sizeClassNames[size],
                    disabledClassNames,
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
        if (!children) {
            return <></>;
        }

        if (!Array.isArray(children)) {
            return <Button {...children.props} {...{ variant, size, disabled }} />;
        }

        const horizontal = direction === 'horizontal';

        return (
            <div className={clsx('nd-button-group', 'nd-flex', !horizontal && 'nd-flex-col', className)} ref={ref}>
                {children.map((child, index) => (
                    <Button
                        key={index}
                        {...child.props}
                        className={clsx([
                            index === 0
                                ? groupFirstClassNames[direction]
                                : index === children.length - 1
                                  ? groupLastClassNames[direction]
                                  : 'nd-rounded-none',
                            index !== 0 && (horizontal ? 'nd-border-l-0' : 'nd-border-t-0'),
                            index !== children.length - 1 && groupDividerClassNames[direction][variant],
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
