import { ReactNode } from 'react';
import type { PopupSize } from '../../popup';
import type { OffsetOptions, Placement } from '@floating-ui/dom';

export interface TooltipProps {
    children?: ReactNode;
    placement?: Placement;
    offset?: OffsetOptions;
    arrowed?: boolean;
    size?: PopupSize;
    delay?: number | [number] | [number, number];
    open?: boolean;
    defaultOpen?: boolean;
    disabled?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
}
