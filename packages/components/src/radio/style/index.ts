import { cva } from '@nild/shared';
import { DISABLED_CLS } from '../../_shared/style';
import { RadioProps, GroupProps } from '../interfaces';

export const radioClassNames = cva<Pick<RadioProps, 'size' | 'disabled'>>(
    ['nd-radio', 'group', ['flex', 'items-center'], 'cursor-pointer', DISABLED_CLS],
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

export const indicatorClassNames = cva<Pick<RadioProps, 'size'>>(
    ['relative', ['flex', 'items-center', 'justify-center']],
    {
        variants: {
            size: {
                small: 'size-3.5',
                medium: 'size-4',
                large: 'size-4.5',
            },
        },
    },
);

export const indicatorInputClassNames = cva<object>([
    ['absolute', 'inset-0', 'opacity-0'],
    ['group-enabled:cursor-pointer', 'group-disabled:cursor-not-allowed'],
]);

export const defaultIndicatorOuterCircleClassNames = cva<Pick<RadioProps, 'variant' | 'checked'>>(
    ['stroke-primary', 'stroke-1', 'transition-[stroke,fill]'],
    {
        compoundVariants: [
            {
                checked: true,
                variant: 'solid',
                className: ['fill-primary', 'group-enabled:group-hover:fill-primary-hover'],
            },
            {
                checked: true,
                variant: 'outlined',
                className: ['fill-transparent', 'group-enabled:group-hover:fill-tertiary-hover'],
            },
            {
                checked: false,
                className: ['fill-transparent', 'group-enabled:group-hover:fill-tertiary-hover'],
            },
        ],
    },
);

export const defaultIndicatorInnerCircleClassNames = cva<Pick<RadioProps, 'variant' | 'checked'>>(
    ['transition-[fill]'],
    {
        variants: {
            variant: {
                solid: 'r-4.5',
                outlined: 'r-5.5',
            },
        },
        compoundVariants: [
            {
                checked: true,
                variant: 'solid',
                className: ['fill-contrast'],
            },
            {
                checked: true,
                variant: 'outlined',
                className: ['fill-primary'],
            },
            {
                checked: false,
                className: ['fill-transparent'],
            },
        ],
    },
);

export const labelClassNames = cva<Pick<RadioProps, 'size'>>(['text-sm'], {
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
