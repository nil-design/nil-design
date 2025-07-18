import { cva } from '@nild/shared';
import { ArrowProps, PortalProps } from '../interfaces';

export const arrowClassNames = cva<ArrowProps>(['nd-arrow', 'bg-container', ['border-solid', 'border-edge']], {
    variants: {
        orientation: {
            up: ['transform-[translateY(-50%)_rotate(45deg)]', ['rounded-tl-sm', 'border-l-1', 'border-t-1']],
            down: ['transform-[translateY(50%)_rotate(45deg)]', ['rounded-br-sm', 'border-r-1', 'border-b-1']],
            left: ['transform-[translateX(-50%)_rotate(45deg)]', ['rounded-bl-sm', 'border-l-1', 'border-b-1']],
            right: ['transform-[translateX(50%)_rotate(45deg)]', ['rounded-tr-sm', 'border-r-1', 'border-t-1']],
        },
        size: {
            small: ['w-1.5', 'h-1.5'],
            medium: ['w-3', 'h-3'],
            large: ['w-4.5', 'h-4.5'],
        },
    },
});

export const portalClassNames = cva<PortalProps>(['nd-portal', ['absolute', 'top-0', 'left-0']]);

export const portalContentClassNames = cva<PortalProps>(
    ['bg-container', 'rounded-md', ['outline-solid', 'outline-1', 'outline-edge'], 'shadow-lg'],
    {
        variants: {
            paddingSize: {
                small: ['px-2', 'py-1'],
                medium: ['px-4', 'py-3'],
                large: ['px-6', 'py-5'],
            },
        },
    },
);

export const portalArrowClassNames = cva<ArrowProps>(['absolute']);
