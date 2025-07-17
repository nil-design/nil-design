import { cnMerge } from '@nild/shared';
import { ReactNode, ReactElement, forwardRef, isValidElement } from 'react';
import { isPlainChildren } from '../_shared/utils';
import { useGroupContext } from './contexts';
import { ButtonProps } from './interfaces';
import { buttonClassNames } from './style';

export const isButtonElement = (child: ReactNode): child is ReactElement<ButtonProps> => {
    return isValidElement(child) && child.type === Button;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const groupContext = useGroupContext();
    const {
        className,
        children,
        variant = groupContext.variant,
        size = groupContext.size,
        shape = 'square',
        equal = groupContext.equal,
        disabled = groupContext.disabled,
        block,
        ...restProps
    } = props;
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
});

Button.displayName = 'Button';

export default Button;
