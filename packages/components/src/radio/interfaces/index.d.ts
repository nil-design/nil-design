import { HTMLAttributes, ReactNode } from 'react';

export type RadioVariant = 'solid' | 'outlined';
export type RadioSize = 'small' | 'medium' | 'large';

export interface RadioProps extends Omit<HTMLAttributes<HTMLLabelElement>, 'onChange' | 'defaultValue'> {
    variant?: RadioVariant;
    size?: RadioSize;
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
    variant?: RadioVariant;
    size?: RadioSize;
    disabled?: boolean;
    value?: T;
    defaultValue?: T;
    onChange?: (value: T) => void;
}
