import { cva } from '@nild/shared';
import { ArrowOrientation, PopupProps, PortalProps } from '../interfaces';

const trigger = cva(['nd-popup-trigger']);

const portal = cva<PortalProps>(['nd-popup-portal', ['absolute', 'top-0', 'left-0']]);

const portalContent = cva<Pick<PopupProps, 'size' | 'inverse'>>(['rounded-md', 'shadow-lg'], {
    variants: {
        size: {
            small: ['px-2', 'py-1'],
            medium: ['px-4', 'py-3'],
            large: ['px-6', 'py-5'],
        },
        inverse: {
            true: ['bg-page-inverse', 'text-main-inverse'],
            false: ['bg-panel', 'text-main'],
        },
    },
});

const arrow = cva<
    Pick<PopupProps, 'size' | 'arrowed' | 'inverse'> & {
        orientation: ArrowOrientation;
    }
>(['nd-popup-arrow', 'absolute'], {
    variants: {
        size: {
            small: ['w-1.5', 'h-1.5'],
            medium: ['w-3', 'h-3'],
            large: ['w-4.5', 'h-4.5'],
        },
        arrowed: {
            true: '',
            false: ['opacity-0', 'invisible'],
        },
        inverse: {
            true: ['bg-page-inverse'],
            false: ['bg-panel'],
        },
        orientation: {
            up: ['transform-[translateY(-50%)_rotate(45deg)]', 'rounded-tl-sm'],
            down: ['transform-[translateY(50%)_rotate(45deg)]', 'rounded-br-sm'],
            left: ['transform-[translateX(-50%)_rotate(45deg)]', 'rounded-bl-sm'],
            right: ['transform-[translateX(50%)_rotate(45deg)]', 'rounded-tr-sm'],
        },
    },
    compoundVariants: [
        {
            orientation: 'up',
            className: ['shadow-[-1px_-1px_0_0_var(--border-color-muted)]'],
        },
        {
            orientation: 'down',
            className: ['shadow-[1px_1px_0_0_var(--border-color-muted)]'],
        },
        {
            orientation: 'left',
            className: ['shadow-[-1px_1px_0_0_var(--border-color-muted)]'],
        },
        {
            orientation: 'right',
            className: ['shadow-[1px_-1px_0_0_var(--border-color-muted)]'],
        },
    ],
});

export default { trigger, portal, portalContent, arrow };
