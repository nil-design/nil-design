import { cva } from '@nild/shared';
import { DISABLED_CLS } from '../../_shared/style';
import { SwitchProps, TrackProps } from '../interfaces';

export const switchClassNames = cva<SwitchProps & { checked: boolean }>(
    [
        'nd-switch',
        'group',
        'h-[var(--nd-switch-height)]',
        'transition-[outline-color]',
        ['relative', 'inline-block', 'font-nd', 'overflow-hidden', 'cursor-pointer'],
        DISABLED_CLS,
    ],
    {
        variants: {
            variant: {
                solid: '',
                outlined: ['outline-solid', 'outline'],
            },
            size: {
                small: ['min-w-8', 'text-sm'],
                medium: ['min-w-10', 'text-md'],
                large: ['min-w-12', 'text-lg'],
            },
            shape: {
                round: 'rounded-full',
                square: 'rounded-md',
            },
        },
        compoundVariants: [
            {
                checked: true,
                variant: 'outlined',
                className: ['outline-brand'],
            },
            {
                checked: false,
                variant: 'outlined',
                className: ['outline-edge', 'enabled:hover:outline-brand-hover'],
            },
        ],
    },
);

export const trackClassNames = cva<Pick<SwitchProps, 'variant' | 'checked'> & Pick<TrackProps, 'type'>>(
    [
        'h-[var(--nd-switch-height)]',
        'transition-[margin-inline,background-color]',
        ['flex', 'justify-center', 'items-center'],
        ['text-center', 'text-on-brand'],
    ],
    {
        variants: {
            type: {
                checked: ['ps-[calc(var(--nd-switch-height)/3)]', 'pe-[calc(var(--nd-switch-height)*1.1)]'],
                unchecked: [
                    'ps-[calc(var(--nd-switch-height)*1.1)]',
                    'pe-[calc(var(--nd-switch-height)/3)]',
                    '-mt-[var(--nd-switch-height)]',
                ],
            },
        },
        compoundVariants: [
            {
                type: 'checked',
                checked: true,
                className: ['ms-0', 'me-0'],
            },
            {
                type: 'checked',
                checked: false,
                className: ['-ms-[100%]', 'me-[100%]'],
            },
            {
                type: 'unchecked',
                checked: true,
                className: ['ms-[100%]', '-me-[100%]'],
            },
            {
                type: 'unchecked',
                checked: false,
                className: ['ms-0', 'me-0'],
            },
            {
                variant: 'solid',
                checked: true,
                className: ['bg-brand', 'group-enabled:group-hover:bg-brand-hover'],
            },
            {
                variant: 'solid',
                checked: false,
                className: ['bg-fill', 'group-enabled:group-hover:bg-fill-hover'],
            },
            {
                variant: 'outlined',
                className: ['bg-transparent'],
            },
        ],
    },
);

export const thumbClassNames = cva<Pick<SwitchProps, 'variant' | 'shape' | 'checked'>>(
    [
        'h-[var(--nd-switch-height)]',
        ['flex', 'justify-center', 'items-center'],
        ['absolute', 'aspect-square', 'scale-80'],
        ['text-on-brand', 'transition-[left,background-color]'],
    ],
    {
        variants: {
            variant: {
                solid: ['bg-on-brand', 'top-0'],
                outlined: ['bg-brand', 'top-0', 'group-enabled:group-hover:bg-brand-hover'],
            },
            shape: {
                round: 'rounded-full',
                square: 'rounded-md',
            },
            checked: {
                true: 'left-[calc(100%-var(--nd-switch-height))]',
                false: 'left-0',
            },
        },
    },
);
