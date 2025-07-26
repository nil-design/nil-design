import { HTMLAttributes, ReactNode } from 'react';
import type { OffsetOptions, Placement } from '@floating-ui/dom';

export type ArrowOrientation = 'up' | 'down' | 'left' | 'right';

export type TriggerAction = 'click' | 'hover' | 'focus' | 'contextMenu';

export interface TriggerProps {
    children?: ReactNode;
}

export interface PortalProps extends HTMLAttributes<HTMLDivElement> {
    container?: Element | DocumentFragment;
}

export type PopupSize = 'small' | 'medium' | 'large';

export interface PopupProps {
    children?: ReactNode;
    placement?: Placement;
    offset?: OffsetOptions;
    action?: TriggerAction | TriggerAction[];
    arrowed?: boolean;
    size?: PopupSize;
    delay?: number | [number] | [number, number];
    open?: boolean;
    defaultOpen?: boolean;
    disabled?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
}
