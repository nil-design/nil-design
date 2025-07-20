import { HTMLAttributes, ReactNode } from 'react';

export type CheckboxVariant = 'solid' | 'outlined';
export type CheckboxSize = 'small' | 'medium' | 'large';

export interface CheckboxProps extends Omit<HTMLAttributes<HTMLLabelElement>, 'onChange' | 'defaultValue'> {
    variant?: CheckboxVariant;
    size?: CheckboxSize;
    disabled?: boolean;
    checked?: boolean;
    defaultChecked?: boolean;
    value?: unknown;
    onChange?: (checked: boolean) => void;
}

export interface IndicatorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: (checked: boolean) => ReactNode;
}

export interface LabelProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
    children?: ReactNode | ((checked: boolean) => ReactNode);
}

export type GroupDirection = 'horizontal' | 'vertical';

export interface GroupProps<T = unknown> extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
    direction?: GroupDirection;
    variant?: CheckboxVariant;
    size?: CheckboxSize;
    disabled?: boolean;
    value?: T[];
    defaultValue?: T[];
    onChange?: (value: T[]) => void;
}
