import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';

export type SplitterOrientation = 'horizontal' | 'vertical';

export interface SplitterProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'onDoubleClick'> {
    children?: ReactNode;
    size?: number[];
    defaultSize?: number[];
    orientation?: SplitterOrientation;
    disabled?: boolean;
    keyboardResizeStep?: number;
    resetOnDoubleClick?: boolean;
    onResize?: (size: number[]) => void;
    onResizeStart?: (size: number[], index: number) => void;
    onResizeEnd?: (size: number[], index: number) => void;
    onDoubleClick?: (size: number[], index: number, evt: MouseEvent<HTMLDivElement>) => void;
}

export interface PanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
    children?: ReactNode;
    defaultSize?: number;
    min?: number;
    max?: number;
    resizable?: boolean;
    collapsible?: boolean;
}

export type GripProps = HTMLAttributes<HTMLSpanElement>;
