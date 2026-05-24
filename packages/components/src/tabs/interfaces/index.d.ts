import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';

export type TabsVariant = 'line' | 'card';
export type TabsSize = 'small' | 'medium' | 'large';
export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsActivation = 'auto' | 'manual';

export interface TabsProps<T = unknown> extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
    children?: ReactNode;
    value?: T;
    defaultValue?: T;
    onChange?: (value: T) => void;
    variant?: TabsVariant;
    size?: TabsSize;
    orientation?: TabsOrientation;
    activation?: TabsActivation;
    disabled?: boolean;
    closable?: boolean;
    onClose?: (value: T, evt: MouseEvent<HTMLButtonElement>) => void;
    destroyOnInactive?: boolean;
}

export interface ListProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

export interface TabProps<T = unknown> extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    value: T;
    disabled?: boolean;
    closable?: boolean;
    children?: ReactNode;
}

export interface PanelProps<T = unknown> extends HTMLAttributes<HTMLDivElement> {
    value: T;
    children?: ReactNode;
}
