import { cva } from '@nild/shared';
import { DISABLED_CLS } from '../../_shared/style';
import { CheckboxProps, GroupProps } from '../interfaces';

export const checkboxClassNames = cva<Pick<CheckboxProps, 'size' | 'disabled'>>(
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

export const indicatorClassNames = cva<Pick<CheckboxProps, 'size'>>(
    ['relative', ['flex', 'items-center', 'justify-center']],
    {
        variants: {
            size: {
                small: 'size-3.5 text-sm',
                medium: 'size-4 text-md',
                large: 'size-4.5 text-lg',
            },
        },
    },
);

export const indicatorInputClassNames = cva<object>([
    ['absolute', 'inset-0', 'opacity-0'],
    ['group-enabled:cursor-pointer', 'group-disabled:cursor-not-allowed'],
]);

export const defaultIndicatorBlockClassNames = cva<Pick<CheckboxProps, 'checked' | 'variant'>>(
    [
        ['flex', 'items-center', 'justify-center'],
        ['size-full', 'rounded-sm', 'border-solid', 'border-1', 'border-primary'],
        'transition-[background-color,color]',
    ],
    {
        compoundVariants: [
            {
                checked: true,
                variant: 'solid',
                className: ['bg-primary text-contrast', 'group-enabled:group-hover:bg-primary-hover'],
            },
            {
                checked: true,
                variant: 'outlined',
                className: ['bg-transparent text-primary', 'group-enabled:group-hover:bg-tertiary-hover'],
            },
            {
                checked: false,
                className: ['bg-transparent text-transparent', 'group-enabled:group-hover:bg-tertiary-hover'],
            },
        ],
    },
);

export const defaultIndicatorIconClassNames = cva<object>(['w-full']);

export const labelClassNames = cva<Pick<CheckboxProps, 'size'>>(['text-sm'], {
    variants: {
        size: {
            small: 'text-sm',
            medium: 'text-md',
            large: 'text-lg',
        },
    },
});

export const groupClassNames = cva<Pick<GroupProps, 'direction'>>(
    ['nd-checkbox-group', ['flex', 'gap-x-4', 'gap-y-2']],
    {
        variants: {
            direction: {
                horizontal: 'flex-row flex-wrap',
                vertical: 'flex-col',
            },
        },
    },
);
