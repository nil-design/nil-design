import clsx from 'clsx';
import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react';
import { ButtonVariant, ButtonSize, variantClassNames, sizeClassNames, disabledClassNames } from './style';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    children?: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, variant = 'solid', size = 'medium', disabled, ...restProps }, ref) => {
        return (
            <button
                type="button"
                disabled={disabled}
                {...restProps}
                className={clsx(
                    ['nd-button', 'nd-font-sans', 'nd-cursor-pointer', 'nd-rounded', 'nd-transition-colors'],
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
);

Button.displayName = 'Button';

export default Button;
