import { cva } from '@nild/shared';
import sharedStyles from '../../_shared/style';
import { SplitterOrientation } from '../interfaces';

const splitter = cva<{
    orientation?: SplitterOrientation;
    disabled?: boolean;
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
        sharedStyles.disabled,
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
    disabled?: boolean;
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
        'before:bg-[var(--border-color-muted)]',
        'before:transition-colors',
        'enabled:hover:before:bg-brand',
        'enabled:focus-visible:before:bg-brand',
        'motion-reduce:before:transition-none',
        sharedStyles.disabled,
    ],
    {
        variants: {
            orientation: {
                horizontal: [
                    'top-0',
                    'bottom-0',
                    'w-3',
                    '-translate-x-1/2',
                    'cursor-col-resize',
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
                    'cursor-row-resize',
                    'before:top-1/2',
                    'before:left-0',
                    'before:right-0',
                    'before:h-px',
                    'before:-translate-y-1/2',
                ],
            },
            disabled: {
                true: '',
                false: '',
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
        'group-focus-visible:ring-focused',
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
                    'bg-muted',
                    'group-enabled:group-hover:bg-brand',
                    'group-focus-visible:bg-brand',
                ],
            },
        },
        defaultVariants: {
            orientation: 'horizontal',
            custom: false,
        },
        compoundVariants: [
            { orientation: 'horizontal', custom: false, className: ['h-8', 'w-1'] },
            { orientation: 'vertical', custom: false, className: ['h-1', 'w-8'] },
            { active: true, custom: false, className: 'bg-brand' },
        ],
    },
);

const actions = cva<{
    orientation?: SplitterOrientation;
}>(
    [
        'nd-splitter-actions',
        'absolute',
        'z-2',
        'flex',
        'items-center',
        'justify-center',
        'gap-0.5',
        'opacity-0',
        'transition-opacity',
        'group-hover:opacity-100',
        'group-focus-within:opacity-100',
        'motion-reduce:transition-none',
    ],
    {
        variants: {
            orientation: {
                horizontal: ['left-1/2', 'top-1/2', '-translate-x-1/2', '-translate-y-1/2', 'flex-col'],
                vertical: ['left-1/2', 'top-1/2', '-translate-x-1/2', '-translate-y-1/2', 'flex-row'],
            },
        },
        defaultVariants: {
            orientation: 'horizontal',
        },
    },
);

const collapseButton = cva<object>([
    'nd-splitter-collapse',
    'inline-flex',
    'size-4',
    'items-center',
    'justify-center',
    'rounded-sm',
    'border',
    'border-muted',
    'bg-canvas',
    'p-0',
    'text-sm',
    'text-subtle',
    'shadow-sm',
    'outline-none',
    'transition-colors',
    'enabled:cursor-pointer',
    'enabled:hover:border-brand-muted',
    'enabled:hover:text-brand',
    'enabled:focus-visible:ring-focused',
    sharedStyles.disabled,
]);

export default {
    splitter,
    panel,
    resizer,
    grip,
    actions,
    collapseButton,
};
