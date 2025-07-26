import { ReactNode } from 'react';
import type { PopupSize, TriggerAction } from '../../popup';
import type { OffsetOptions, Placement } from '@floating-ui/dom';

export interface PopoverProps {
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
