import { cva } from '@nild/shared';
import { DISABLED_CLS } from '../../_shared/style';
import { CheckboxProps, GroupProps } from '../interfaces';

const checkbox = cva<Pick<CheckboxProps, 'size' | 'disabled'>>(
    ['nd-checkbox', 'group', ['flex', 'items-center'], 'cursor-pointer', DISABLED_CLS],
    {
        variants: {
            size: {
                small: 'gap-1.5',
                medium: 'gap-2',
                large: 'gap-2.5',
            },
            disabled: {
                true: 'disabled',
                false: '',
            },
        },
    },
);

const indicator = cva<Pick<CheckboxProps, 'size'>>(['relative', ['flex', 'items-center', 'justify-center']], {
    variants: {
        size: {
            small: 'size-3.5 text-sm',
            medium: 'size-4 text-md',
            large: 'size-4.5 text-lg',
        },
    },
});

const indicatorInput = cva<object>([
    ['absolute', 'inset-0', 'opacity-0'],
    ['group-enabled:cursor-pointer', 'group-disabled:cursor-not-allowed'],
]);

const defaultIndicatorBlock = cva<Pick<CheckboxProps, 'checked' | 'variant'>>(
    [
        ['flex', 'items-center', 'justify-center'],
        ['size-full', 'rounded-sm', 'border'],
        'transition-[background-color,color,border-color]',
    ],
    {
        compoundVariants: [
            {
                checked: true,
                variant: 'solid',
                className: ['bg-brand border-brand text-brand-contrast', 'group-enabled:group-hover:bg-brand-hover'],
            },
            {
                checked: true,
                variant: 'outlined',
                className: [
                    'bg-transparent border-brand text-brand',
                    'group-enabled:group-hover:border-brand-hover',
                    'group-enabled:group-hover:text-brand-hover',
                ],
            },
            {
                checked: false,
                className: [
                    'bg-transparent border-main text-transparent',
                    'group-enabled:group-hover:border-brand-hover',
                ],
            },
        ],
    },
);

const defaultIndicatorIcon = cva<object>(['w-full']);

const label = cva<Pick<CheckboxProps, 'size'>>(['text-sm'], {
    variants: {
        size: {
            small: 'text-sm',
            medium: 'text-md',
            large: 'text-lg',
        },
    },
});

const group = cva<Pick<GroupProps, 'direction'>>(['nd-checkbox-group', ['flex', 'gap-x-4', 'gap-y-2']], {
    variants: {
        direction: {
            horizontal: 'flex-row flex-wrap',
            vertical: 'flex-col',
        },
    },
});

export default {
    checkbox,
    indicator,
    indicatorInput,
    defaultIndicatorBlock,
    defaultIndicatorIcon,
    label,
    group,
};
