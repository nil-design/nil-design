import { HTMLAttributes } from 'react';

export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerDirection = 'horizontal' | 'vertical';
export type DividerAlign = 'left' | 'center' | 'right';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
    variant?: DividerVariant;
    direction?: DividerDirection;
    align?: DividerAlign;
}
