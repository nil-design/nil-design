import type { ButtonProps } from '../../button';
import type { HTMLAttributes, ReactNode } from 'react';

export type ModalPlacement = 'center' | 'left' | 'right' | 'top' | 'bottom';
export type ModalSize = 'small' | 'medium' | 'large' | 'full';
export type ModalVariant = 'dialog' | 'drawer';
export type DrawerPlacement = Exclude<ModalPlacement, 'center'>;

export interface TriggerProps {
    children?: ReactNode;
}

export interface PortalProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'aria-label' | 'aria-labelledby' | 'aria-describedby'> {
    children?: ReactNode;
    container?: Element | DocumentFragment;
    overlayless?: boolean;
    overlayClassName?: string;
    surfaceClassName?: string;
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

export interface ModalCommonProps {
    children?: ReactNode;
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

export interface DialogProps extends ModalCommonProps {
    variant?: 'dialog';
    placement?: 'center';
}

export interface DrawerProps extends ModalCommonProps {
    variant: 'drawer';
    placement?: DrawerPlacement;
}

export type ModalProps = DialogProps | DrawerProps;
export type ModalAccessibility = Pick<ModalCommonProps, 'aria-label' | 'aria-labelledby' | 'aria-describedby'>;
