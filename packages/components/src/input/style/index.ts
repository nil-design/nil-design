import { cva } from '@nild/shared';
import sharedVariants from '../../_shared/style';
import { CompositeProps, InputProps, OTPProps } from '../interfaces';

const composite = cva<Pick<CompositeProps, 'block' | 'disabled'>>(
    ['nd-input-composite', 'inline-flex', 'items-stretch', sharedVariants.disabled()],
    {
        variants: {
            block: {
                true: ['flex', 'w-full'],
                false: '',
            },
        },
    },
);

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
                className: ['mr-[-1px]', 'hover:z-1'],
            },
        ],
    },
);

const inputWrapper = cva<InputProps>(
    [
        'nd-input-wrapper',
        'group',
        ['inline-flex', 'items-center', 'box-border', 'font-nd', 'transition-colors', 'overflow-hidden'],
        ['border', 'enabled:focus-within:z-1'],
        sharedVariants.disabled(),
    ],
    {
        variants: {
            variant: {
                outlined: [
                    'bg-transparent',
                    'border-main',
                    'enabled:hover:border-brand-hover',
                    'enabled:focus-within:border-brand',
                    'enabled:focus-visible-within:ring-focused',
                ],
                filled: [
                    'bg-muted',
                    'border-subtle',
                    'enabled:[&:hover:not(:focus-within)]:bg-muted-hover',
                    'enabled:[&:hover:not(:focus-within)]:border-muted',
                    'enabled:focus-within:border-brand',
                    'enabled:focus-visible-within:ring-focused',
                ],
                underlined: [
                    'bg-transparent',
                    'border-transparent',
                    'border-b-main',
                    'enabled:[&:hover:not(:focus-within)]:border-b-brand-hover',
                    'enabled:focus-within:border-b-brand',
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
        ],
    },
);

const input = cva<Pick<InputProps, 'size' | 'variant'>>(
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
                small: ['text-sm'],
                medium: ['text-md'],
                large: ['text-lg'],
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
    },
);

const prefix = cva<Pick<InputProps, 'size' | 'variant'>>(
    ['nd-input-prefix', 'shrink-0', 'h-full', 'inline-flex', 'items-center', 'text-muted'],
    {
        variants: {
            size: {
                small: ['text-sm'],
                medium: ['text-md'],
                large: ['text-lg'],
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
    },
);

const suffix = cva<Pick<InputProps, 'size' | 'variant'>>(
    ['nd-input-suffix', 'shrink-0', 'h-full', 'inline-flex', 'items-center', 'text-muted'],
    {
        variants: {
            size: {
                small: ['text-sm'],
                medium: ['text-md'],
                large: ['text-lg'],
            },
        },
        compoundVariants: [
            {
                variant: ['outlined', 'filled'],
                size: 'small',
                className: ['pr-2'],
            },
            {
                variant: ['outlined', 'filled'],
                size: 'medium',
                className: ['pr-3'],
            },
            {
                variant: ['outlined', 'filled'],
                size: 'large',
                className: ['pr-4'],
            },
        ],
    },
);

const prepend = cva<Pick<InputProps, 'variant' | 'size'> & { type: 'string' | 'element' }>(['shrink-0'], {
    variants: {
        variant: {
            outlined: ['mr-[-1px]', 'hover:z-1', 'focus:z-1', 'focus-within:z-1'],
            filled: [],
            underlined: [],
        },
        type: {
            string: ['inline-flex', 'items-center', 'border'],
            element: [],
        },
        size: {
            small: ['h-6', 'text-sm'],
            medium: ['h-8', 'text-md'],
            large: ['h-10', 'text-lg'],
        },
    },
    compoundVariants: [
        {
            type: 'element',
            variant: ['outlined', 'filled'],
            className: ['rounded-r-none'],
        },
        {
            type: ['string', 'element'],
            variant: ['outlined', 'filled'],
            size: 'small',
            className: ['rounded-l-sm'],
        },
        {
            type: ['string', 'element'],
            variant: ['outlined', 'filled'],
            size: ['medium', 'large'],
            className: ['rounded-l-md'],
        },
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
            variant: 'underlined',
            className: ['bg-transparent', 'border-transparent', 'border-b-main', 'text-muted'],
        },
        {
            type: 'string',
            variant: ['outlined', 'filled'],
            size: 'small',
            className: ['px-2'],
        },
        {
            type: 'string',
            variant: ['outlined', 'filled'],
            size: 'medium',
            className: ['px-3'],
        },
        {
            type: 'string',
            variant: ['outlined', 'filled'],
            size: 'large',
            className: ['px-4'],
        },
    ],
});

const append = cva<Pick<InputProps, 'variant' | 'size'> & { type: 'string' | 'element' }>(['shrink-0'], {
    variants: {
        variant: {
            outlined: [],
            filled: [],
            underlined: [],
        },
        type: {
            string: ['inline-flex', 'items-center', 'border'],
            element: ['h-auto'],
        },
        size: {
            small: ['h-6', 'text-sm'],
            medium: ['h-8', 'text-md'],
            large: ['h-10', 'text-lg'],
        },
    },
    compoundVariants: [
        {
            type: 'element',
            variant: ['outlined', 'filled'],
            className: ['rounded-l-none'],
        },
        {
            type: ['string', 'element'],
            variant: ['outlined', 'filled'],
            size: 'small',
            className: ['rounded-r-sm'],
        },
        {
            type: ['string', 'element'],
            variant: ['outlined', 'filled'],
            size: ['medium', 'large'],
            className: ['rounded-r-md'],
        },
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
            variant: 'underlined',
            className: ['bg-transparent', 'border-transparent', 'border-b-main', 'text-muted'],
        },
        {
            type: 'string',
            variant: ['outlined', 'filled'],
            size: 'small',
            className: ['px-2'],
        },
        {
            type: 'string',
            variant: ['outlined', 'filled'],
            size: 'medium',
            className: ['px-3'],
        },
        {
            type: 'string',
            variant: ['outlined', 'filled'],
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
