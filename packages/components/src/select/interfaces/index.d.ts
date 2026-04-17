import type { InputSize, InputVariant } from '../../input';
import type { OffsetOptions, Placement } from '@floating-ui/dom';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export type SelectVariant = InputVariant;
export type SelectSize = InputSize;

export interface SelectCommonProps
    extends Omit<
        ButtonHTMLAttributes<HTMLButtonElement>,
        'children' | 'defaultValue' | 'id' | 'onChange' | 'size' | 'value'
    > {
    children?: ReactNode;
    placeholder?: string;
    variant?: SelectVariant;
    size?: SelectSize;
    block?: boolean;
    disabled?: boolean;
    placement?: Placement;
    offset?: OffsetOptions;
}

export interface SingleSelectProps<T = unknown> extends SelectCommonProps {
    multiple?: false;
    value?: T;
    defaultValue?: T;
    onChange?: (value: T | undefined) => void;
}

export interface MultipleSelectProps<T = unknown> extends SelectCommonProps {
    multiple: true;
    value?: T[];
    defaultValue?: T[];
    onChange?: (value: T[]) => void;
}

export type SelectProps<T = unknown> = SingleSelectProps<T> | MultipleSelectProps<T>;

export interface SelectOptionProps<T = unknown> extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'value'> {
    value: T;
    label: string;
    size?: SelectSize;
    disabled?: boolean;
    selected?: boolean;
    active?: boolean;
    children?: ReactNode;
}
