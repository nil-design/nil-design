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

export type GroupDirection = 'horizontal' | 'vertical';

export interface GroupProps extends HTMLAttributes<HTMLDivElement> {
    direction?: GroupDirection;
    variant?: ButtonVariant;
    size?: ButtonSize;
    equal?: boolean;
    disabled?: boolean;
    children?: ReactElement<ButtonProps> | ReactElement<ButtonProps>[];
}
