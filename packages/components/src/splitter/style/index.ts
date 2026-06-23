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
        'before:rounded-full',
        'before:bg-muted',
        'before:transition-colors',
        'enabled:hover:before:bg-brand-subtle',
        'enabled:focus:before:bg-brand-subtle',
        'motion-reduce:before:transition-none',
    ],
    {
        variants: {
            orientation: {
                horizontal: [
                    'top-0',
                    'bottom-0',
                    'w-1.5',
                    '-translate-x-1/2',
                    'enabled:cursor-col-resize',
                    'before:top-0',
                    'before:bottom-0',
                    'before:left-1/2',
                    'before:w-1',
                    'before:-translate-x-1/2',
                ],
                vertical: [
                    'left-0',
                    'right-0',
                    'h-1.5',
                    '-translate-y-1/2',
                    'enabled:cursor-row-resize',
                    'before:top-1/2',
                    'before:left-0',
                    'before:right-0',
                    'before:h-1',
                    'before:-translate-y-1/2',
                ],
            },
            active: {
                true: [
                    'before:bg-brand-subtle-hover',
                    'enabled:hover:before:bg-brand-subtle-hover',
                    'enabled:focus:before:bg-brand-subtle-hover',
                ],
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
                false: ['rounded-full', 'bg-emphasized', 'group-enabled:group-hover:bg-brand'],
            },
        },
        defaultVariants: {
            orientation: 'horizontal',
            custom: false,
        },
        compoundVariants: [
            { orientation: 'horizontal', custom: false, className: ['h-8', 'w-1'] },
            { orientation: 'vertical', custom: false, className: ['h-1', 'w-8'] },
            {
                active: false,
                custom: false,
                className: ['group-focus-within:bg-brand', 'group-focus-within:ring-focused'],
            },
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
