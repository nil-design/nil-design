import { HTMLAttributes, Ref } from 'react';

export type ArrowSize = 'small' | 'medium' | 'large';
export type ArrowOrientation = 'up' | 'down' | 'left' | 'right';

export interface ArrowProps extends HTMLAttributes<HTMLDivElement> {
    orientation?: ArrowOrientation;
    size?: ArrowSize;
}

export type PaddingSize = 'small' | 'medium' | 'large';

export interface ArrowOptions extends ArrowProps {
    ref: Ref<HTMLDivElement>;
}

export interface PortalProps extends HTMLAttributes<HTMLDivElement> {
    container?: Element | DocumentFragment;
    paddingSize?: PaddingSize;
    arrow?: ArrowOptions | false;
}
