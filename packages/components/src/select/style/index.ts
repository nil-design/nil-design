import { cva } from '@nild/shared';
import sharedStyles from '../../_shared/style';
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
        sharedStyles.disabled,
    ],
    {
        variants: {
            variant: {
                outlined: ['bg-transparent', 'border-main', 'enabled:hover:border-brand-hover'],
                filled: ['bg-muted', 'border-subtle'],
                underlined: [
                    'bg-transparent',
                    'border-transparent',
                    'border-b-main',
                    'enabled:hover:border-b-brand-hover',
                    'enabled:focus-visible:border-b-brand',
                ],
            },
            size: {
                small: ['h-6', 'text-sm'],
                medium: ['h-8', 'text-md'],
                large: ['h-10', 'text-lg'],
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
                true: ['z-1'],
                false: '',
            },
        },
        compoundVariants: [
            {
                variant: ['outlined', 'filled'],
                size: 'small',
                className: ['rounded-sm'],
            },
            {
                variant: ['outlined', 'filled'],
                size: ['medium', 'large'],
                className: ['rounded-md'],
            },
            {
                variant: ['outlined', 'filled'],
                open: true,
                className: ['border-brand', 'ring-focused'],
            },
            {
                variant: 'underlined',
                open: true,
                className: ['border-b-brand'],
            },
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
    variant?: SelectVariant;
    size?: SelectSize;
    placeholder?: boolean;
}>(['nd-select-trigger-content', 'min-w-0', 'flex-auto', 'truncate'], {
    variants: {
        size: {
            small: ['text-sm'],
            medium: ['text-md'],
            large: ['text-lg'],
        },
        placeholder: {
            true: ['text-subtle'],
            false: ['text-main'],
        },
    },
    compoundVariants: [
        {
            variant: ['outlined', 'filled'],
            size: 'small',
            className: ['pl-2'],
        },
        {
            variant: ['outlined', 'filled'],
            size: 'medium',
            className: ['pl-3'],
        },
        {
            variant: ['outlined', 'filled'],
            size: 'large',
            className: ['pl-4'],
        },
    ],
});

const triggerIcon = cva<{
    variant?: SelectVariant;
    size?: SelectSize;
    open?: boolean;
}>(['nd-select-trigger-icon', 'shrink-0', 'inline-flex', 'items-center', 'text-muted', 'transition-transform'], {
    variants: {
        size: {
            small: ['text-sm'],
            medium: ['text-md'],
            large: ['text-lg'],
        },
        open: {
            true: ['rotate-180'],
            false: '',
        },
    },
    compoundVariants: [
        {
            variant: ['outlined', 'filled'],
            size: 'small',
            className: ['px-2'],
        },
        {
            variant: ['outlined', 'filled'],
            size: 'medium',
            className: ['px-3'],
        },
        {
            variant: ['outlined', 'filled'],
            size: 'large',
            className: ['px-4'],
        },
    ],
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
        sharedStyles.disabled,
    ],
    {
        variants: {
            size: {
                small: ['min-h-8', 'px-2', 'text-sm'],
                medium: ['min-h-9', 'px-3', 'text-md'],
                large: ['min-h-10', 'px-4', 'text-lg'],
            },
            disabled: {
                true: ['text-subtle'],
                false: ['cursor-pointer'],
            },
            active: {
                true: ['bg-surface-muted'],
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
