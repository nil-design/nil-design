import { cva } from '@nild/shared';
import { DISABLED_CLS } from '../../_shared/style';
import { ButtonProps, GroupProps } from '../interfaces';

export const buttonClassNames = cva<ButtonProps>(
    ['nd-button', ['font-nd', 'cursor-pointer', 'transition-colors'], ['whitespace-nowrap', 'truncate'], DISABLED_CLS],
    {
        variants: {
            variant: {
                solid: ['bg-brand', 'text-on-brand', 'enabled:hover:bg-brand-hover', 'enabled:active:bg-brand-active'],
                outlined: [
                    'bg-transparent',
                    'border-solid',
                    'border',
                    'border-brand',
                    'text-brand',
                    'enabled:hover:text-brand-hover',
                    'enabled:active:text-brand-active',
                    'enabled:hover:bg-surface-hover',
                    'enabled:active:bg-surface-active',
                ],
                filled: [
                    'bg-surface',
                    'text-brand',
                    'enabled:hover:text-brand-hover',
                    'enabled:active:text-brand-active',
                    'enabled:hover:bg-surface-hover',
                    'enabled:active:bg-surface-active',
                ],
                text: [
                    'bg-transparent',
                    'text-brand',
                    'enabled:hover:text-brand-hover',
                    'enabled:active:text-brand-active',
                    'enabled:hover:bg-surface-hover',
                    'enabled:active:bg-surface-active',
                ],
            },
            shape: {
                round: ['rounded-full'],
                square: ['rounded-md'],
            },
            size: {
                small: ['px-2', 'h-6', 'text-sm'],
                medium: ['px-4', 'h-8', 'text-md'],
                large: ['px-6', 'h-10', 'text-lg'],
            },
            block: {
                true: 'w-full',
                false: '',
            },
            disabled: {
                true: 'disabled',
                false: '',
            },
            equal: {
                true: ['flex', 'justify-center', 'items-center'],
                false: '',
            },
        },
        compoundVariants: [
            {
                size: 'small',
                equal: true,
                className: ['w-6 h-6', 'p-1'],
            },
            {
                size: 'medium',
                equal: true,
                className: ['w-8 h-8', 'p-1.5'],
            },
            {
                size: 'large',
                equal: true,
                className: ['w-10 h-10', 'p-2'],
            },
        ],
    },
);

export const groupClassNames = cva<GroupProps>(['nd-button-group', ['flex']], {
    variants: {
        direction: {
            horizontal: '',
            vertical: 'flex-col',
        },
    },
});

export const groupButtonClassNames = cva<GroupProps & { first?: boolean; last?: boolean }>('', {
    compoundVariants: [
        {
            first: true,
            direction: 'horizontal',
            className: 'rounded-r-none',
        },
        {
            first: true,
            direction: 'vertical',
            className: 'rounded-b-none',
        },
        {
            last: true,
            direction: 'horizontal',
            className: 'rounded-l-none',
        },
        {
            last: true,
            direction: 'vertical',
            className: 'rounded-t-none',
        },
        {
            first: false,
            last: false,
            className: 'rounded-none',
        },
        {
            first: false,
            direction: 'horizontal',
            className: 'border-l-0',
        },
        {
            first: false,
            direction: 'vertical',
            className: 'border-t-0',
        },
        {
            last: false,
            direction: 'horizontal',
            variant: 'solid',
            className: ['border-solid', 'border-r', 'border-r-brand-hover'],
        },
        {
            last: false,
            direction: 'horizontal',
            variant: ['filled', 'text'],
            className: ['border-solid', 'border-r', 'border-r-surface-hover'],
        },
        {
            last: false,
            direction: 'vertical',
            variant: 'solid',
            className: ['border-solid', 'border-b', 'border-b-brand-hover'],
        },
        {
            last: false,
            direction: 'vertical',
            variant: ['filled', 'text'],
            className: ['border-solid', 'border-b', 'border-b-surface-hover'],
        },
    ],
});
