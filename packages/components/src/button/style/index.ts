import { cva } from '@nild/shared';
import { DISABLED_CLS } from '../../_shared/style';
import { ButtonProps, ButtonGroupProps } from '../interfaces';

export const buttonClassNames = cva<ButtonProps & { plain?: boolean }>(
    ['nd-button', ['font-nd', 'cursor-pointer', 'transition-colors'], DISABLED_CLS],
    {
        variants: {
            variant: {
                solid: [
                    'bg-primary',
                    'text-contrast',
                    'enabled:hover:bg-primary-hover',
                    'enabled:active:bg-primary-active',
                ],
                outlined: [
                    'bg-transparent',
                    'border-solid',
                    'border',
                    'border-primary',
                    'text-primary',
                    'enabled:hover:bg-tertiary-hover',
                    'enabled:active:bg-tertiary-active',
                ],
                filled: [
                    'bg-tertiary',
                    'text-primary',
                    'enabled:hover:bg-tertiary-hover',
                    'enabled:active:bg-tertiary-active',
                ],
                text: [
                    'bg-transparent',
                    'text-primary',
                    'enabled:hover:bg-tertiary-hover',
                    'enabled:active:bg-tertiary-active',
                ],
            },
            shape: {
                round: ['rounded-full'],
                square: ['rounded-md'],
            },
            size: {
                small: ['px-2', 'text-sm'],
                medium: ['px-4', 'text-md'],
                large: ['px-6', 'text-lg'],
            },
            plain: {
                true: ['whitespace-nowrap', 'truncate'],
                false: '',
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
                plain: false,
                className: ['py-1'],
            },
            {
                size: 'small',
                plain: true,
                className: ['h-6'],
            },
            {
                size: 'small',
                equal: true,
                className: ['w-6 h-6', 'p-1'],
            },
            {
                size: 'medium',
                plain: false,
                className: ['py-1.5'],
            },
            {
                size: 'medium',
                plain: true,
                className: ['h-8'],
            },
            {
                size: 'medium',
                equal: true,
                className: ['w-8 h-8', 'p-1.5'],
            },
            {
                size: 'large',
                plain: false,
                className: ['py-2'],
            },
            {
                size: 'large',
                plain: true,
                className: ['h-10'],
            },
            {
                size: 'large',
                equal: true,
                className: ['w-10 h-10', 'p-2'],
            },
        ],
    },
);

export const groupClassNames = cva<ButtonGroupProps>(['nd-button-group', ['flex']], {
    variants: {
        direction: {
            horizontal: '',
            vertical: 'flex-col',
        },
    },
});

export const groupButtonClassNames = cva<ButtonGroupProps & { first?: boolean; last?: boolean }>('', {
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
            className: ['border-solid', 'border-r', 'border-r-primary-hover'],
        },
        {
            last: false,
            direction: 'horizontal',
            variant: ['filled', 'text'],
            className: ['border-solid', 'border-r', 'border-r-tertiary-hover'],
        },
        {
            last: false,
            direction: 'vertical',
            variant: 'solid',
            className: ['border-solid', 'border-b', 'border-b-primary-hover'],
        },
        {
            last: false,
            direction: 'vertical',
            variant: ['filled', 'text'],
            className: ['border-solid', 'border-b', 'border-b-tertiary-hover'],
        },
    ],
});
