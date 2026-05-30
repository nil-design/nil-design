import { cva } from '@nild/shared';
import sharedStyles from '../../_shared/style';
import { SegmentOrientation, SegmentProps, SegmentSize } from '../interfaces';

const segment = cva<Pick<SegmentProps, 'block'> & { orientation?: SegmentOrientation }>(
    [
        'nd-segment',
        'relative',
        'isolate',
        'font-nd',
        'rounded-md',
        'bg-muted',
        'p-0.5',
        'text-main',
        sharedStyles.disabled,
    ],
    {
        variants: {
            orientation: {
                horizontal: ['flex-row', 'items-center'],
                vertical: ['flex-col', 'items-stretch'],
            },
            block: {
                true: ['flex', 'w-full'],
                false: 'inline-flex',
            },
        },
    },
);

const indicator = cva<object>([
    'nd-segment-indicator',
    'pointer-events-none',
    'absolute',
    'top-0',
    'left-0',
    'z-0',
    'rounded-sm',
    'bg-canvas',
    'shadow-sm',
    'transition-[transform,width,height,opacity]',
    'ease-out',
    'motion-reduce:transition-none',
]);

const item = cva<{
    orientation?: SegmentOrientation;
    size?: SegmentSize;
    selected?: boolean;
    disabled?: boolean;
    block?: boolean;
}>(
    [
        'nd-segment-item',
        'relative',
        'z-1',
        'inline-flex',
        'min-w-0',
        'items-center',
        'justify-center',
        'rounded-sm',
        'border-0',
        'bg-transparent',
        'select-none',
        'outline-none',
        'transition-[background-color,box-shadow,color]',
        'focus-visible:ring-focused',
        sharedStyles.disabled,
    ],
    {
        variants: {
            orientation: {
                horizontal: '',
                vertical: ['w-full', 'justify-start'],
            },
            size: {
                small: ['min-h-5', 'gap-1', 'px-2', 'text-sm'],
                medium: ['min-h-7', 'gap-1.5', 'px-3', 'text-md'],
                large: ['min-h-9', 'gap-2', 'px-4', 'text-lg'],
            },
            selected: {
                true: 'text-brand',
                false: '',
            },
            disabled: {
                true: '',
                false: 'cursor-pointer',
            },
            block: {
                true: '',
                false: '',
            },
        },
        compoundVariants: [
            {
                selected: false,
                disabled: false,
                className: ['text-main', 'hover:text-brand-hover'],
            },
            {
                selected: false,
                disabled: true,
                className: 'text-subtle',
            },
            {
                block: true,
                orientation: 'horizontal',
                className: 'flex-1',
            },
        ],
    },
);

export default {
    segment,
    indicator,
    item,
};
