import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export type SegmentSize = 'small' | 'medium' | 'large';
export type SegmentOrientation = 'horizontal' | 'vertical';

export interface SegmentProps<T = unknown> extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
    children?: ReactNode;
    value?: T;
    defaultValue?: T;
    onChange?: (value: T) => void;
    size?: SegmentSize;
    orientation?: SegmentOrientation;
    disabled?: boolean;
    block?: boolean;
}

export interface ItemProps<T = unknown> extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onChange'> {
    value: T;
    disabled?: boolean;
    children?: ReactNode;
}
