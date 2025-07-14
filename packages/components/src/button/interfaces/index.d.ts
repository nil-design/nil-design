import type { ButtonHTMLAttributes, HTMLAttributes, ReactElement } from 'react';

export type ButtonVariant = 'solid' | 'outlined' | 'filled' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonShape = 'round' | 'square';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    shape?: ButtonShape;
    equal?: boolean;
    disabled?: boolean;
    block?: boolean;
}

export type ButtonGroupDirection = 'horizontal' | 'vertical';

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
    direction?: ButtonGroupDirection;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    children?: ReactElement<ButtonProps> | ReactElement<ButtonProps>[];
}
