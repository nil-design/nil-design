import { cva } from '@nild/shared';
import { DISABLED_CLS } from '../../_shared/style';
import { ButtonProps, GroupProps } from '../interfaces';

const button = cva<ButtonProps>(
    ['nd-button', ['font-nd', 'cursor-pointer', 'transition-colors'], ['whitespace-nowrap', 'truncate'], DISABLED_CLS],
    {
        variants: {
            variant: {
                solid: [
                    'bg-brand',
                    'text-brand-contrast',
                    'enabled:hover:bg-brand-hover',
                    'enabled:active:bg-brand-active',
                ],
                outlined: [
                    'bg-transparent',
                    'border',
                    'border-main',
                    'text-main',
                    'enabled:hover:border-brand-hover',
                    'enabled:hover:text-brand-hover',
                    'enabled:active:border-brand-active',
                    'enabled:active:text-brand-active',
                ],
                filled: ['bg-muted', 'text-main', 'enabled:hover:bg-muted-hover', 'enabled:active:bg-muted-active'],
                text: ['bg-transparent', 'text-main', 'enabled:hover:bg-muted-hover', 'enabled:active:bg-muted-active'],
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

const group = cva<GroupProps>(['nd-button-group', ['flex']], {
    variants: {
        direction: {
            horizontal: '',
            vertical: 'flex-col',
        },
    },
});

const groupedButton = cva<GroupProps & { first?: boolean; last?: boolean }>('', {
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
            last: false,
            direction: 'horizontal',
            variant: 'outlined',
            className: ['mr-[-1px]', 'hover:z-1'],
        },
        {
            last: false,
            direction: 'vertical',
            variant: 'outlined',
            className: ['mb-[-1px]', 'hover:z-1'],
        },
        {
            last: false,
            direction: 'horizontal',
            variant: 'solid',
            className: ['border-r', 'border-r-brand-hover'],
        },
        {
            last: false,
            direction: 'horizontal',
            variant: ['filled', 'text'],
            className: ['border-r', 'border-r-muted'],
        },
        {
            last: false,
            direction: 'vertical',
            variant: 'solid',
            className: ['border-b', 'border-b-brand-hover'],
        },
        {
            last: false,
            direction: 'vertical',
            variant: ['filled', 'text'],
            className: ['border-b', 'border-b-muted'],
        },
    ],
});

export default {
    button,
    group,
    groupedButton,
};
