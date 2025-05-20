import clsx from 'clsx';
import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react';
import { ButtonVariant, ButtonSize, variantClassNames, sizeClassNames } from './style';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    children?: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, variant = 'solid', size = 'medium' }, ref) => {
        return (
            <button
                type="button"
                className={clsx(
                    ['nd-button', 'nd-font-sans', 'nd-cursor-pointer', 'nd-rounded', 'nd-transition-colors'],
                    variantClassNames[variant],
                    sizeClassNames[size],
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
