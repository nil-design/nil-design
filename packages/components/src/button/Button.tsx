import { isArray } from 'lodash-es';
import {
    ReactNode,
    ButtonHTMLAttributes,
    forwardRef,
    ForwardRefExoticComponent,
    RefAttributes,
    ReactElement,
} from 'react';
import { disabledClassNames } from '../_core/style';
import { cn, isEmptyChildren, isPlainChildren } from '../_core/utils';
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
        const plain = isPlainChildren(children);

        return (
            <button
                type="button"
                {...restProps}
                disabled={disabled}
                className={cn(
                    ['nd-button', 'font-sans', 'cursor-pointer', 'rounded-md', 'transition-colors'],
                    block && ['w-full'],
                    variantClassNames[variant],
                    sizeClassNames[size].concat(
                        {
                            small: [plain ? 'h-6' : 'py-1'],
                            medium: [plain ? 'h-8' : 'py-1.5'],
                            large: [plain ? 'h-10' : 'py-2'],
                        }[size],
                    ),
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
                                ? groupFirstClassNames[direction]
                                : index === children.length - 1
                                  ? groupLastClassNames[direction]
                                  : 'rounded-none',
                            index !== 0 && (horizontal ? 'border-l-0' : 'border-t-0'),
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
