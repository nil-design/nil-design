import { cva } from '@nild/shared';
import { DISABLED_CLS } from '../../_shared/style';
import { InputProps, OTPProps } from '../interfaces';

const composite = cva<{ block?: boolean }>(['nd-input-composite', 'inline-flex', 'items-stretch'], {
    variants: {
        block: {
            true: ['flex', 'w-full'],
            false: '',
        },
    },
});

const compositedInputWrapper = cva<Pick<InputProps, 'variant'> & { prepended?: boolean; appended?: boolean }>(
    ['flex-auto'],
    {
        variants: {
            prepended: {
                true: ['rounded-l-none'],
                false: '',
            },
            appended: {
                true: ['rounded-r-none'],
                false: '',
            },
        },
        compoundVariants: [
            {
                variant: 'outlined',
                appended: true,
                className: ['mr-[-1px]', 'hover:z-1', 'focus-within:z-1'],
            },
        ],
    },
);

const inputWrapper = cva<InputProps>(
    [
        'nd-input-wrapper',
        'group',
        ['inline-flex', 'items-center', 'box-border', 'font-nd', 'transition-colors', 'overflow-hidden'],
        ['border', 'enabled:focus-within:border-brand'],
        DISABLED_CLS,
    ],
    {
        variants: {
            variant: {
                outlined: ['bg-transparent', 'border-main', 'enabled:hover:border-brand-hover'],
                filled: [
                    'bg-muted',
                    'border-subtle',
                    'enabled:[&:hover:not(:focus-within)]:bg-muted-hover',
                    'enabled:[&:hover:not(:focus-within)]:border-muted',
                ],
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
                true: 'disabled',
                false: '',
            },
        },
    },
);

const input = cva<InputProps>(
    [
        'nd-input',
        'flex-auto',
        'h-full',
        'bg-transparent',
        'border-none',
        'outline-none',
        'p-0',
        'm-0',
        'text-main',
        'placeholder:text-subtle',
        'disabled:cursor-not-allowed',
        /* Hide the default number input styles */
        '[&::-ms-reveal]:hidden',
        '[&::-ms-clear]:hidden',
        '[&::-webkit-inner-spin-button]:appearance-none',
        '[&::-webkit-outer-spin-button]:appearance-none',
        '[&::-webkit-inner-spin-button]:m-0',
        '[&::-webkit-outer-spin-button]:m-0',
        '[-moz-appearance:textfield]',
    ],
    {
        variants: {
            size: {
                small: ['px-2', 'text-sm'],
                medium: ['px-3', 'text-md'],
                large: ['px-4', 'text-lg'],
            },
        },
    },
);

const prefix = cva<InputProps>(['nd-input-prefix', 'shrink-0', 'h-full', 'inline-flex', 'items-center', 'text-muted'], {
    variants: {
        size: {
            small: ['pl-2', 'text-sm'],
            medium: ['pl-3', 'text-md'],
            large: ['pl-4', 'text-lg'],
        },
    },
});

const suffix = cva<InputProps>(['nd-input-suffix', 'shrink-0', 'h-full', 'inline-flex', 'items-center', 'text-muted'], {
    variants: {
        size: {
            small: ['pr-2', 'text-sm'],
            medium: ['pr-3', 'text-md'],
            large: ['pr-4', 'text-lg'],
        },
    },
});

const prepend = cva<Pick<InputProps, 'variant' | 'size'> & { type: 'string' | 'element' }>(['shrink-0'], {
    variants: {
        variant: {
            outlined: ['mr-[-1px]', 'hover:z-1', 'focus:z-1', 'focus-within:z-1'],
            filled: [],
        },
        type: {
            string: ['inline-flex', 'items-center', 'border'],
            element: ['rounded-r-none'],
        },
        size: {
            small: ['h-6', 'text-sm', 'rounded-l-sm'],
            medium: ['h-8', 'text-md', 'rounded-l-md'],
            large: ['h-10', 'text-lg', 'rounded-l-md'],
        },
    },
    compoundVariants: [
        {
            type: 'string',
            variant: 'outlined',
            className: ['bg-muted', 'border-main', 'text-muted'],
        },
        {
            type: 'string',
            variant: 'filled',
            className: ['bg-brand', 'border-transparent', 'text-brand-contrast'],
        },
        {
            type: 'string',
            size: 'small',
            className: ['px-2'],
        },
        {
            type: 'string',
            size: 'medium',
            className: ['px-3'],
        },
        {
            type: 'string',
            size: 'large',
            className: ['px-4'],
        },
    ],
});

const append = cva<Pick<InputProps, 'variant' | 'size'> & { type: 'string' | 'element' }>(['shrink-0'], {
    variants: {
        type: {
            string: ['inline-flex', 'items-center', 'border'],
            element: ['rounded-l-none', 'h-auto'],
        },
        size: {
            small: ['h-6', 'text-sm', 'rounded-r-sm'],
            medium: ['h-8', 'text-md', 'rounded-r-md'],
            large: ['h-10', 'text-lg', 'rounded-r-md'],
        },
    },
    compoundVariants: [
        {
            type: 'string',
            variant: 'outlined',
            className: ['bg-muted', 'border-main', 'text-muted'],
        },
        {
            type: 'string',
            variant: 'filled',
            className: ['bg-brand', 'border-transparent', 'text-brand-contrast'],
        },
        {
            type: 'string',
            size: 'small',
            className: ['px-2'],
        },
        {
            type: 'string',
            size: 'medium',
            className: ['px-3'],
        },
        {
            type: 'string',
            size: 'large',
            className: ['px-4'],
        },
    ],
});

/**
 * Preset component styles
 */

const searchIcon = cva<InputProps>(['group-focus-within:text-brand']);

const otpWrapper = cva<Pick<OTPProps, 'block'>>(['gap-2', 'items-center'], {
    variants: {
        block: {
            true: ['flex', 'w-full'],
            false: ['inline-flex'],
        },
    },
});

const otpInputWrapper = cva<Pick<InputProps, 'block' | 'size'>>(['flex-auto', 'min-w-0', 'text-center'], {
    compoundVariants: [
        {
            size: 'small',
            block: false,
            className: ['w-6'],
        },
        {
            size: 'medium',
            block: false,
            className: ['w-8'],
        },
        {
            size: 'large',
            block: false,
            className: ['w-10'],
        },
    ],
});

export default {
    composite,
    compositedInputWrapper,
    inputWrapper,
    input,
    prefix,
    suffix,
    prepend,
    append,
    searchIcon,
    otpWrapper,
    otpInputWrapper,
};
