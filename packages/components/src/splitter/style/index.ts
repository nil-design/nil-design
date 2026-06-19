import { cva } from '@nild/shared';
import { SplitterOrientation } from '../interfaces';

const splitter = cva<{
    orientation?: SplitterOrientation;
}>(
    [
        'nd-splitter',
        'relative',
        'flex',
        'box-border',
        'min-w-0',
        'min-h-0',
        'overflow-hidden',
        'rounded-md',
        'border',
        'border-main',
        'bg-canvas',
        'font-nd',
        'text-main',
    ],
    {
        variants: {
            orientation: {
                horizontal: ['flex-row'],
                vertical: ['flex-col'],
            },
        },
        defaultVariants: {
            orientation: 'horizontal',
        },
    },
);

const panel = cva<object>(['nd-splitter-panel', 'relative', 'min-w-0', 'min-h-0', 'overflow-auto']);

const resizer = cva<{
    orientation?: SplitterOrientation;
    active?: boolean;
}>(
    [
        'nd-splitter-resizer',
        'group',
        'absolute',
        'z-1',
        'flex',
        'items-center',
        'justify-center',
        'outline-none',
        'touch-none',
        'select-none',
        'before:absolute',
        'before:pointer-events-none',
        'before:content-[""]',
        'before:bg-[var(--border-color-main)]',
        'before:transition-colors',
        'enabled:hover:before:bg-brand',
        'enabled:focus:before:bg-brand',
        'motion-reduce:before:transition-none',
    ],
    {
        variants: {
            orientation: {
                horizontal: [
                    'top-0',
                    'bottom-0',
                    'w-3',
                    '-translate-x-1/2',
                    'enabled:cursor-col-resize',
                    'before:top-0',
                    'before:bottom-0',
                    'before:left-1/2',
                    'before:w-px',
                    'before:-translate-x-1/2',
                ],
                vertical: [
                    'left-0',
                    'right-0',
                    'h-3',
                    '-translate-y-1/2',
                    'enabled:cursor-row-resize',
                    'before:top-1/2',
                    'before:left-0',
                    'before:right-0',
                    'before:h-px',
                    'before:-translate-y-1/2',
                ],
            },
            active: {
                true: 'before:bg-brand',
                false: '',
            },
        },
        defaultVariants: {
            orientation: 'horizontal',
        },
    },
);

const grip = cva<{
    orientation?: SplitterOrientation;
    active?: boolean;
    custom?: boolean;
}>(
    [
        'nd-splitter-grip',
        'relative',
        'z-1',
        'inline-flex',
        'items-center',
        'justify-center',
        'transition-colors',
        'group-focus:ring-focused',
        'motion-reduce:transition-none',
    ],
    {
        variants: {
            orientation: {
                horizontal: '',
                vertical: '',
            },
            active: {
                true: '',
                false: '',
            },
            custom: {
                true: ['rounded-sm', 'text-subtle'],
                false: [
                    'rounded-full',
                    'bg-subtle',
                    'border',
                    'border-main',
                    'group-enabled:group-hover:bg-brand-subtle',
                    'group-enabled:group-hover:border-brand',
                    'group-focus:bg-brand-subtle',
                    'group-focus:border-brand',
                ],
            },
        },
        defaultVariants: {
            orientation: 'horizontal',
            custom: false,
        },
        compoundVariants: [
            { orientation: 'horizontal', custom: false, className: ['h-8', 'w-1.5'] },
            { orientation: 'vertical', custom: false, className: ['h-1.5', 'w-8'] },
            { active: true, custom: false, className: 'bg-brand' },
        ],
    },
);

export default {
    splitter,
    panel,
    resizer,
    grip,
};
