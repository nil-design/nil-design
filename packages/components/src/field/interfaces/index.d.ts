import type { HTMLAttributes, ReactNode } from 'react';

export type FieldStatus = 'success' | 'warning' | 'error';
export type FieldBind = 'value' | 'checked';

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
    name?: string;
    required?: boolean;
    disabled?: boolean;
    bind?: FieldBind;
    children?: ReactNode;
}

export interface LabelProps extends HTMLAttributes<HTMLSpanElement> {
    children?: ReactNode;
}

export interface HelperProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

export interface StatusProps extends HTMLAttributes<HTMLDivElement> {
    type?: FieldStatus;
    children?: ReactNode;
}

export interface RequiredIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
    children?: ReactNode;
}
