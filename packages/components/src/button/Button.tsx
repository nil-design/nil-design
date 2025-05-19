import clsx from 'clsx';
import { ReactNode, forwardRef } from 'react';

export interface ButtonProps {
    className?: string;
    children?: ReactNode;
    variant?: 'solid' | 'outlined' | 'text';
    size?: 'small' | 'medium' | 'large';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, variant = 'solid', size = 'medium' }, ref) => {
        return (
            <button
                type="button"
                className={clsx(
                    'nd-button',
                    ['nd-cursor-pointer', 'nd-rounded'],
                    variant === 'solid' && [],
                    variant === 'outlined' && [],
                    variant === 'text' && [],
                    size === 'small' && [],
                    size === 'medium' && [],
                    size === 'large' && [],
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
