import { cva } from '@nild/shared';
import sharedStyles from '../../_shared/style';
import { SliderOrientation, SliderSize, SliderVariant } from '../interfaces';

const thumbInteractionClassNames = [
    'group-enabled:group-hover:ring-focused',
    'group-enabled:group-focus-visible:ring-focused',
];

const slider = cva<{
    orientation?: SliderOrientation;
    size?: SliderSize;
    variant?: SliderVariant;
    block?: boolean;
    disabled?: boolean;
}>(
    [
        'nd-slider',
        'group',
        'relative',
        'inline-flex',
        'box-border',
        'font-nd',
        'touch-none',
        'select-none',
        'outline-none',
        sharedStyles.disabled,
    ],
    {
        variants: {
            orientation: {
                horizontal: ['w-48', 'items-center'],
                vertical: ['h-40', 'justify-center'],
            },
            size: {
                small: [
                    '[--nd-slider-size:1rem]',
                    '[--nd-slider-track-size:0.125rem]',
                    '[--nd-slider-thumb-size:0.75rem]',
                ],
                medium: [
                    '[--nd-slider-size:1.25rem]',
                    '[--nd-slider-track-size:0.25rem]',
                    '[--nd-slider-thumb-size:0.875rem]',
                ],
                large: [
                    '[--nd-slider-size:1.5rem]',
                    '[--nd-slider-track-size:0.375rem]',
                    '[--nd-slider-thumb-size:1rem]',
                ],
            },
            variant: {
                floating: '',
                contained: '',
            },
            block: {
                true: '',
                false: '',
            },
            disabled: {
                true: '',
                false: 'cursor-pointer',
            },
        },
        defaultVariants: {
            orientation: 'horizontal',
            size: 'medium',
            variant: 'floating',
        },
        compoundVariants: [
            { orientation: 'horizontal', className: 'h-[var(--nd-slider-size)]' },
            { orientation: 'vertical', className: 'w-[var(--nd-slider-size)]' },
            { size: 'small', variant: 'contained', className: '[--nd-slider-size:0.625rem]' },
            { size: 'medium', variant: 'contained', className: '[--nd-slider-size:0.75rem]' },
            { size: 'large', variant: 'contained', className: '[--nd-slider-size:0.875rem]' },
            {
                orientation: 'horizontal',
                block: true,
                className: 'w-full',
            },
            {
                orientation: 'vertical',
                block: true,
                className: 'h-full',
            },
        ],
    },
);

const track = cva<{
    orientation?: SliderOrientation;
    variant?: SliderVariant;
}>(['nd-slider-track', 'absolute', 'rounded-full', 'bg-muted'], {
    variants: {
        orientation: {
            horizontal: ['left-0', 'right-0', 'h-[var(--nd-slider-track-size)]'],
            vertical: ['top-0', 'bottom-0', 'w-[var(--nd-slider-track-size)]'],
        },
        variant: {
            floating: '',
            contained: '',
        },
    },
    defaultVariants: {
        orientation: 'horizontal',
        variant: 'floating',
    },
    compoundVariants: [
        { orientation: 'horizontal', variant: 'contained', className: 'h-full' },
        { orientation: 'vertical', variant: 'contained', className: 'w-full' },
    ],
});

const range = cva<{
    orientation?: SliderOrientation;
    variant?: SliderVariant;
}>(['nd-slider-range', 'absolute', 'rounded-full', 'bg-brand', 'pointer-events-none'], {
    variants: {
        orientation: {
            horizontal: ['left-0', 'h-[var(--nd-slider-track-size)]'],
            vertical: ['bottom-0', 'w-[var(--nd-slider-track-size)]'],
        },
        variant: {
            floating: '',
            contained: '',
        },
    },
    defaultVariants: {
        orientation: 'horizontal',
        variant: 'floating',
    },
    compoundVariants: [
        { orientation: 'horizontal', variant: 'contained', className: 'h-full' },
        { orientation: 'vertical', variant: 'contained', className: 'w-full' },
    ],
});

const thumb = cva<{
    orientation?: SliderOrientation;
    size?: SliderSize;
    variant?: SliderVariant;
}>(
    [
        'nd-slider-thumb',
        'absolute',
        'inline-flex',
        'items-center',
        'justify-center',
        'rounded-full',
        'text-[0.625rem]',
        'leading-none',
        'pointer-events-none',
        'transition-[box-shadow]',
    ],
    {
        variants: {
            orientation: {
                horizontal: ['top-1/2', '-translate-x-1/2', '-translate-y-1/2'],
                vertical: ['left-1/2', '-translate-x-1/2', 'translate-y-1/2'],
            },
            size: {
                small: '',
                medium: '',
                large: '',
            },
            variant: {
                floating: '',
                contained: '',
            },
        },
        defaultVariants: {
            variant: 'floating',
        },
        compoundVariants: [
            {
                variant: 'floating',
                className: [
                    'size-[var(--nd-slider-thumb-size)]',
                    'box-border',
                    'border-2',
                    'border-brand',
                    'bg-brand-contrast',
                    'text-brand',
                    thumbInteractionClassNames,
                ],
            },
            {
                variant: 'contained',
                className: [
                    'box-content',
                    'aspect-square',
                    'border-2',
                    'border-canvas',
                    'bg-brand',
                    'text-brand-contrast',
                    thumbInteractionClassNames,
                ],
            },
            {
                orientation: 'horizontal',
                variant: 'contained',
                className: 'h-full',
            },
            {
                orientation: 'vertical',
                variant: 'contained',
                className: 'w-full',
            },
        ],
    },
);

export default {
    slider,
    track,
    range,
    thumb,
};
