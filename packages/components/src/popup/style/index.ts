import { cva } from '@nild/shared';
import { ArrowOrientation, PopupProps, PortalProps } from '../interfaces';

export const triggerClassNames = cva(['nd-popup-trigger']);

export const portalClassNames = cva<PortalProps>(['nd-popup-portal', ['absolute', 'top-0', 'left-0']]);

export const portalContentClassNames = cva<Pick<PopupProps, 'size' | 'inverse' | 'borderless'>>(
    ['rounded-md', 'shadow-lg'],
    {
        variants: {
            size: {
                small: ['px-2', 'py-1'],
                medium: ['px-4', 'py-3'],
                large: ['px-6', 'py-5'],
            },
            inverse: {
                true: ['bg-inverse', 'text-inverse'],
                false: ['bg-panel', 'text-body'],
            },
            borderless: {
                true: '',
                false: ['outline-solid', 'outline-1', 'outline-edge'],
            },
        },
    },
);

export const arrowClassNames = cva<
    Pick<PopupProps, 'size' | 'arrowed' | 'inverse' | 'borderless'> & {
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
            true: ['bg-inverse'],
            false: ['bg-panel'],
        },
        borderless: {
            true: '',
            false: ['border-solid', 'border-edge'],
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
            borderless: false,
            orientation: 'up',
            className: ['border-l-1', 'border-t-1'],
        },
        {
            borderless: false,
            orientation: 'down',
            className: ['border-r-1', 'border-b-1'],
        },

        {
            borderless: false,
            orientation: 'left',
            className: ['border-l-1', 'border-b-1'],
        },

        {
            borderless: false,
            orientation: 'right',
            className: ['border-r-1', 'border-t-1'],
        },
    ],
});
