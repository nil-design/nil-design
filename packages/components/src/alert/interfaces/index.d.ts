import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    type?: AlertType;
    closable?: boolean;
    visible?: boolean;
    defaultVisible?: boolean;
    closeAriaLabel?: string;
    onClose?: (event: MouseEvent<HTMLButtonElement>) => void;
    children?: ReactNode;
}

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
    children?: ReactNode;
}

export interface TitleProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
