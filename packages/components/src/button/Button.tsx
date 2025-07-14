import { cnMerge, isEmpty } from '@nild/shared';
import {
    ReactElement,
    RefAttributes,
    ForwardRefExoticComponent,
    forwardRef,
    ReactNode,
    isValidElement,
    Children,
} from 'react';
import { isPlainChildren } from '../_shared/utils';
import { ButtonProps, ButtonGroupProps } from './interfaces';
import { buttonClassNames, groupClassNames, groupButtonClassNames } from './style';

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
                    buttonClassNames({
                        variant,
                        size,
                        shape,
                        equal,
                        plain,
                        block,
                        disabled,
                    }),
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

const isButtonElement = (child: ReactNode): child is ReactElement<ButtonProps> => {
    return isValidElement(child) && child.type === Button;
};

const Group = forwardRef<HTMLDivElement, ButtonGroupProps>(
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

        const buttonChildren = children.filter(isButtonElement);

        return (
            <div {...restProps} className={cnMerge(groupClassNames({ direction }), className)} ref={ref}>
                {buttonChildren.map((child, index) => (
                    <Button
                        key={index}
                        {...child.props}
                        className={groupButtonClassNames({
                            first: index === 0,
                            last: index === buttonChildren.length - 1,
                            direction,
                            variant,
                        })}
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
