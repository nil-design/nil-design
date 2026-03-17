import { cva } from '@nild/shared';
import { DISABLED_CLS } from '../../_shared/style';
import { RadioProps, GroupProps } from '../interfaces';

const radio = cva<Pick<RadioProps, 'size' | 'disabled'>>(
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

const indicator = cva<Pick<RadioProps, 'size'> & { default?: boolean }>(
    ['nd-radio-indicator', 'relative', ['flex', 'items-center', 'justify-center']],
    {
        variants: {
            size: {
                small: 'size-3.5 text-sm',
                medium: 'size-4 text-md',
                large: 'size-4.5 text-lg',
            },
            default: {
                true: ['rounded-full', 'transition-[box-shadow]', 'group-enabled:focus-visible-within:ring-focused'],
                false: '',
            },
        },
    },
);

const indicatorInput = cva<object>([
    ['absolute', 'inset-0', 'opacity-0'],
    ['group-enabled:cursor-pointer', 'group-disabled:cursor-not-allowed'],
]);

const defaultIndicatorSvg = cva<object>(['size-full']);

const defaultIndicatorOuterCircle = cva<Pick<RadioProps, 'variant' | 'checked'>>(
    ['stroke-1', 'r-9', 'transition-[stroke,fill]', 'group-enabled:group-hover:stroke-brand-hover'],
    {
        compoundVariants: [
            {
                checked: true,
                variant: 'solid',
                className: ['fill-brand stroke-brand', 'group-enabled:group-hover:fill-brand-hover'],
            },
            {
                checked: true,
                variant: 'outlined',
                className: ['fill-transparent stroke-brand'],
            },
            {
                checked: false,
                className: ['fill-transparent stroke-main'],
            },
        ],
    },
);

const defaultIndicatorInnerCircle = cva<Pick<RadioProps, 'variant' | 'checked'>>(['transition-[fill]'], {
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
            className: ['fill-brand-contrast'],
        },
        {
            checked: true,
            variant: 'outlined',
            className: ['fill-brand', 'group-enabled:group-hover:fill-brand-hover'],
        },
        {
            checked: false,
            className: ['fill-transparent'],
        },
    ],
});

const label = cva<Pick<RadioProps, 'size'>>(['text-sm'], {
    variants: {
        size: {
            small: 'text-sm',
            medium: 'text-md',
            large: 'text-lg',
        },
    },
});

const group = cva<Pick<GroupProps, 'direction'>>(['nd-radio-group', ['flex', 'gap-x-4', 'gap-y-2']], {
    variants: {
        direction: {
            horizontal: 'flex-row flex-wrap',
            vertical: 'flex-col',
        },
    },
});

export default {
    radio,
    indicator,
    indicatorInput,
    defaultIndicatorSvg,
    defaultIndicatorOuterCircle,
    defaultIndicatorInnerCircle,
    label,
    group,
};
