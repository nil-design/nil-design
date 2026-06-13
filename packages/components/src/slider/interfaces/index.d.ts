import type { HTMLAttributes, ReactNode } from 'react';

export type SliderOrientation = 'horizontal' | 'vertical';
export type SliderSize = 'small' | 'medium' | 'large';
export type SliderVariant = 'floating' | 'contained';

export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
    children?: ReactNode;
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    orientation?: SliderOrientation;
    size?: SliderSize;
    variant?: SliderVariant;
    block?: boolean;
    disabled?: boolean;
    onChange?: (value: number) => void;
    onComplete?: (value: number) => void;
}

export type TrackProps = HTMLAttributes<HTMLSpanElement>;

export type RangeProps = HTMLAttributes<HTMLSpanElement>;

export type ThumbProps = HTMLAttributes<HTMLSpanElement>;
