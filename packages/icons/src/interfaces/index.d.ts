import { IIconProps as ParkIconProps, StrokeLinecap, StrokeLinejoin } from '@icon-park/react/es/runtime';
import { FC, HTMLAttributes } from 'react';

export type IconVariant = 'outlined' | 'filled' | 'two-tone' | 'multi-color';

export interface DynamicIconProps extends HTMLAttributes<HTMLSpanElement> {
    name?: string;
    variant?: IconVariant;
    strokeWidth?: number;
    strokeLinecap?: StrokeLinecap;
    strokeLinejoin?: StrokeLinejoin;
    fill?: string | string[];
    spin?: boolean;
}

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
    component?: FC<ParkIconProps>;
    variant?: IconVariant;
    strokeWidth?: number;
    strokeLinecap?: StrokeLinecap;
    strokeLinejoin?: StrokeLinejoin;
    fill?: string | string[];
    spin?: boolean;
}
