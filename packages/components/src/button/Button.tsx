import { cnJoin, cnMerge, isEmpty } from '@nild/shared';
import {
    ReactElement,
    ButtonHTMLAttributes,
    HTMLAttributes,
    RefAttributes,
    ForwardRefExoticComponent,
    forwardRef,
    ReactNode,
    isValidElement,
    Children,
} from 'react';
import { DISABLED_CLS } from '../_shared/style';
import { isPlainChildren } from '../_shared/utils';
import {
    ButtonVariant,
    ButtonSize,
    ButtonShape,
    GroupDirection,
    VARIANT_CLS_MAP,
    SIZE_CLS_MAP,
    SHAPE_CLS_MAP,
    EQUAL_CLS_MAP,
    GROUP_FIRST_CLS_MAP,
    GROUP_LAST_CLS_MAP,
    GROUP_DIVIDER_CLS_MAP,
} from './style';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    shape?: ButtonShape;
    equal?: boolean;
    disabled?: boolean;
    block?: boolean;
}

/**
 * @category Components
 */
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
                className={cnMerge(
                    'nd-button',
                    'font-nd cursor-pointer transition-colors',
                    DISABLED_CLS,
                    block && 'w-full',
                    plain && 'whitespace-nowrap truncate',
                    VARIANT_CLS_MAP[variant],
                    SIZE_CLS_MAP[size][`${plain}`],
                    SHAPE_CLS_MAP[shape],
                    equal && EQUAL_CLS_MAP[size],
                    className,
                )}
                ref={ref}
            >
                {children}
            </button>
        );
    },
) as ForwardRefExoticComponent<ButtonProps & RefAttributes<HTMLButtonElement>> & {
    Group: typeof Group;
};

Button.displayName = 'Button';

export interface GroupProps extends HTMLAttributes<HTMLDivElement>, Pick<ButtonProps, 'variant' | 'size' | 'disabled'> {
    children?: ReactElement<ButtonProps> | ReactElement<ButtonProps>[];
    direction?: GroupDirection;
}

const isButtonElement = (child: ReactNode): child is ReactElement<ButtonProps> => {
    return isValidElement(child) && child.type === Button;
};

const Group = forwardRef<HTMLDivElement, GroupProps>(
    (
        {
            className,
            children: externalChildren,
            variant = 'solid',
            size = 'medium',
            disabled,
            direction = 'horizontal',
            ...restProps
        },
        ref,
    ) => {
        const children = Children.toArray(externalChildren);

        if (!children || isEmpty(children)) {
            return null;
        }

        if (children.length === 1) {
            const [child] = children;
            if (isButtonElement(child)) {
                return <Button {...child.props} {...{ variant, size, disabled }} />;
            } else {
                return null;
            }
        }

        const horizontal = direction === 'horizontal';
        const buttonChildren = children.filter(isButtonElement);

        return (
            <div
                {...restProps}
                className={cnMerge('nd-button-group', 'flex', !horizontal && 'flex-col', className)}
                ref={ref}
            >
                {buttonChildren.map((child, index) => (
                    <Button
                        key={index}
                        {...child.props}
                        className={cnJoin(
                            index === 0
                                ? GROUP_FIRST_CLS_MAP[direction]
                                : index === buttonChildren.length - 1
                                  ? GROUP_LAST_CLS_MAP[direction]
                                  : 'rounded-none',
                            index !== 0 && (horizontal ? 'border-l-0' : 'border-t-0'),
                            index !== buttonChildren.length - 1 && GROUP_DIVIDER_CLS_MAP[direction][variant],
                        )}
                        {...{ variant, size, disabled }}
                    />
                ))}
            </div>
        );
    },
);

Group.displayName = 'Button.Group';

Button.Group = Group;

export default Button;
