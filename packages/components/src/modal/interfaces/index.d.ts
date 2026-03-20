import type { ButtonProps } from '../../button';
import type { HTMLAttributes, ReactNode } from 'react';

export type ModalPlacement = 'center' | 'left' | 'right' | 'top' | 'bottom';
export type ModalSize = 'small' | 'medium' | 'large' | 'full';

export interface TriggerProps {
    children?: ReactNode;
}

export interface PortalProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    container?: Element | DocumentFragment;
    overlaid?: boolean;
}

export interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

export interface BodyProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

export interface FooterProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

export type CloseProps = ButtonProps;

export interface ModalProps {
    children?: ReactNode;
    placement?: ModalPlacement;
    size?: ModalSize;
    open?: boolean;
    defaultOpen?: boolean;
    disabled?: boolean;
    closeOnEscape?: boolean;
    closeOnOverlayClick?: boolean;
    trapFocus?: boolean;
    restoreFocus?: boolean;
    lockScroll?: boolean;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    onOpen?: () => void;
    onClose?: () => void;
}
