import clsx from 'clsx';
import { ReactNode, forwardRef } from 'react';

export interface ButtonProps {
    className?: string;
    children?: ReactNode;
    type?: 'solid' | 'outlined' | 'text';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, children }, ref) => {
    return (
        <button className={clsx('nd-button', 'nd-cursor-pointer', className)} ref={ref}>
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
