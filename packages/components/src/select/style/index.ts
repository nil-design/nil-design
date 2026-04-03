import { cva } from '@nild/shared';
import { DISABLED_CLS } from '../../_shared/style';
import { SelectSize, SelectVariant } from '../interfaces';

const trigger = cva<{
    variant?: SelectVariant;
    size?: SelectSize;
    block?: boolean;
    disabled?: boolean;
    open?: boolean;
}>(
    [
        'nd-select-trigger',
        'group',
        ['inline-flex', 'items-center'],
        'box-border',
        'font-nd',
        'overflow-hidden',
        'text-left',
        'appearance-none',
        'border',
        'transition-colors',
        'outline-none',
        DISABLED_CLS,
    ],
    {
        variants: {
            variant: {
                outlined: ['bg-transparent', 'border-main', 'enabled:hover:border-brand-hover'],
                filled: ['bg-muted', 'border-subtle'],
            },
            size: {
                small: ['h-6', 'text-sm', 'rounded-sm'],
                medium: ['h-8', 'text-md', 'rounded-md'],
                large: ['h-10', 'text-lg', 'rounded-md'],
            },
            block: {
                true: ['flex', 'w-full'],
                false: '',
            },
            disabled: {
                true: '',
                false: 'cursor-pointer',
            },
            open: {
                true: ['border-brand', 'z-1', 'ring-focused'],
                false: '',
            },
        },
        compoundVariants: [
            {
                variant: 'filled',
                disabled: false,
                open: false,
                className: ['enabled:hover:bg-muted-hover', 'enabled:hover:border-muted'],
            },
            {
                variant: 'filled',
                open: true,
                className: ['bg-muted-hover'],
            },
        ],
    },
);

const triggerContent = cva<{
    size?: SelectSize;
    placeholder?: boolean;
}>(['nd-select-trigger-content', 'min-w-0', 'flex-auto', 'truncate'], {
    variants: {
        size: {
            small: ['pl-2', 'text-sm'],
            medium: ['pl-3', 'text-md'],
            large: ['pl-4', 'text-lg'],
        },
        placeholder: {
            true: ['text-subtle'],
            false: ['text-main'],
        },
    },
});

const triggerIcon = cva<{
    size?: SelectSize;
    open?: boolean;
}>(['nd-select-trigger-icon', 'shrink-0', 'inline-flex', 'items-center', 'text-muted', 'transition-transform'], {
    variants: {
        size: {
            small: ['px-2', 'text-sm'],
            medium: ['px-3', 'text-md'],
            large: ['px-4', 'text-lg'],
        },
        open: {
            true: ['rotate-180'],
            false: '',
        },
    },
});

const listbox = cva<object>([
    'nd-select-listbox',
    'max-h-60',
    'overflow-auto',
    'overscroll-contain',
    'px-1',
    'py-1',
    'outline-none',
]);

const option = cva<{
    size?: SelectSize;
    disabled?: boolean;
    active?: boolean;
}>(
    [
        'nd-select-option',
        'w-full',
        'flex',
        'items-center',
        'gap-2',
        'rounded-sm',
        'text-left',
        'text-main',
        'select-none',
        'transition-colors',
    ],
    {
        variants: {
            size: {
                small: ['min-h-8', 'px-2', 'text-sm'],
                medium: ['min-h-9', 'px-3', 'text-md'],
                large: ['min-h-10', 'px-4', 'text-lg'],
            },
            disabled: {
                true: ['cursor-not-allowed', 'select-none', 'text-subtle', 'opacity-50'],
                false: ['cursor-pointer', 'hover:bg-muted-hover'],
            },
            active: {
                true: ['bg-muted'],
                false: '',
            },
        },
    },
);

const optionContent = cva<object>(['nd-select-option-content', 'min-w-0', 'flex-auto']);

const optionLabel = cva<object>(['nd-select-option-label', 'block', 'truncate']);

const optionIndicator = cva<{
    size?: SelectSize;
}>(['nd-select-option-indicator', 'shrink-0', 'inline-flex', 'items-center', 'justify-center'], {
    variants: {
        size: {
            small: ['size-3.5', 'text-sm'],
            medium: ['size-4', 'text-md'],
            large: ['size-4.5', 'text-lg'],
        },
    },
});

export default {
    trigger,
    triggerContent,
    triggerIcon,
    listbox,
    option,
    optionContent,
    optionLabel,
    optionIndicator,
};
