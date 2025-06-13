import { CSSProperties } from 'react';

export type ArrowSize = 'small' | 'medium' | 'large';

export const ARROW_SIZE_CLS_MAP: Record<ArrowSize, string> = {
    small: 'w-1.5 h-1.5',
    medium: 'w-3 h-3',
    large: 'w-4.5 h-4.5',
};

export type ArrowOrientation = 'up' | 'down' | 'left' | 'right';

export const ARROW_ORIENTATION_STYLE_MAP: Record<ArrowOrientation, Pick<CSSProperties, 'clipPath' | 'transform'>> = {
    up: {
        transform: 'translateY(-50%) rotate(45deg)',
    },
    down: {
        transform: 'translateY(50%) rotate(45deg)',
    },
    left: {
        transform: 'translateX(-50%) rotate(45deg)',
    },
    right: {
        transform: 'translateX(50%) rotate(45deg)',
    },
};

export const ARROW_ORIENTATION_CLS_MAP: Record<ArrowOrientation, string> = {
    up: 'rounded-tl-sm border-l-1 border-t-1',
    down: 'rounded-br-sm border-r-1 border-b-1',
    left: 'rounded-bl-sm border-l-1 border-b-1',
    right: 'rounded-tr-sm border-r-1 border-t-1',
};

export type PaddingSize = 'small' | 'medium' | 'large';

export const PADDING_SIZE_CLS_MAP: Record<PaddingSize, string> = {
    small: 'px-2 py-1',
    medium: 'px-4 py-3',
    large: 'px-6 py-5',
};
