import { cva } from '@nild/shared';
import { DISABLED_CLS } from '../../_shared/style';
import { TabsOrientation, TabsSize, TabsVariant } from '../interfaces';

const tabs = cva<{
    orientation?: TabsOrientation;
    variant?: TabsVariant;
}>(['nd-tabs', 'font-nd', 'text-main'], {
    variants: {
        orientation: {
            horizontal: '',
            vertical: ['flex', 'items-start'],
        },
        variant: {
            line: '',
            card: '',
        },
    },
    compoundVariants: [
        {
            orientation: 'vertical',
            variant: 'line',
            className: 'gap-4',
        },
        {
            orientation: 'vertical',
            variant: 'card',
            className: 'items-stretch',
        },
    ],
});

const list = cva<{
    orientation?: TabsOrientation;
    variant?: TabsVariant;
}>(['nd-tabs-list', 'flex', 'shrink-0'], {
    variants: {
        orientation: {
            horizontal: ['flex-row', 'items-end'],
            vertical: ['flex-col', 'items-stretch'],
        },
        variant: {
            line: '',
            card: '',
        },
    },
    compoundVariants: [
        {
            orientation: 'horizontal',
            variant: 'line',
            className: ['border-b', 'border-main'],
        },
        {
            orientation: 'vertical',
            variant: 'line',
            className: ['border-r', 'border-main'],
        },
        {
            orientation: 'horizontal',
            variant: 'card',
            className: ['mb-[-1px]', 'gap-1'],
        },
        {
            orientation: 'vertical',
            variant: 'card',
            className: ['mr-[-1px]', 'gap-1'],
        },
    ],
});

const tab = cva<{
    orientation?: TabsOrientation;
    variant?: TabsVariant;
    size?: TabsSize;
    selected?: boolean;
    disabled?: boolean;
    closable?: boolean;
}>(
    [
        'nd-tabs-tab',
        'group',
        'relative',
        'inline-flex',
        'items-center',
        'justify-center',
        'min-w-0',
        'select-none',
        'outline-none',
        'transition-[background-color,border-color,color]',
        'focus-visible:ring-focused',
        DISABLED_CLS,
    ],
    {
        variants: {
            orientation: {
                horizontal: '',
                vertical: ['w-full', 'justify-start'],
            },
            variant: {
                line: ['bg-transparent', 'border-transparent'],
                card: ['border', 'border-main'],
            },
            size: {
                small: ['min-h-7', 'gap-1', 'px-2', 'text-sm'],
                medium: ['min-h-8', 'gap-1.5', 'px-3', 'text-md'],
                large: ['min-h-10', 'gap-2', 'px-4', 'text-lg'],
            },
            selected: {
                true: '',
                false: '',
            },
            disabled: {
                true: ['disabled', 'cursor-not-allowed'],
                false: ['cursor-pointer'],
            },
            closable: {
                true: '',
                false: '',
            },
        },
        compoundVariants: [
            {
                variant: 'line',
                orientation: 'horizontal',
                className: ['border-b-2', 'mb-[-1px]'],
            },
            {
                variant: 'line',
                orientation: 'vertical',
                className: ['border-r-2', 'mr-[-1px]'],
            },
            {
                variant: 'line',
                selected: true,
                className: ['text-brand', 'border-brand'],
            },
            {
                variant: 'line',
                selected: false,
                disabled: false,
                className: ['text-muted', 'hover:text-brand-hover'],
            },
            {
                variant: 'card',
                orientation: 'horizontal',
                className: ['rounded-t-md', 'border-b-main'],
            },
            {
                variant: 'card',
                orientation: 'vertical',
                className: ['rounded-l-md', 'border-r-main'],
            },
            {
                variant: 'card',
                selected: true,
                className: ['z-1', 'bg-panel', 'text-brand'],
            },
            {
                variant: 'card',
                selected: false,
                disabled: false,
                className: ['bg-muted', 'text-main', 'hover:bg-muted-hover', 'hover:text-brand-hover'],
            },
            {
                variant: 'card',
                selected: true,
                orientation: 'horizontal',
                className: 'border-b-[var(--background-color-panel)]',
            },
            {
                variant: 'card',
                selected: true,
                orientation: 'vertical',
                className: 'border-r-[var(--background-color-panel)]',
            },
            {
                closable: true,
                size: 'small',
                className: 'pr-1',
            },
            {
                closable: true,
                size: 'medium',
                className: 'pr-1.5',
            },
            {
                closable: true,
                size: 'large',
                className: 'pr-2',
            },
        ],
    },
);

const tabContent = cva<object>(['nd-tabs-tab-content', 'min-w-0', 'truncate']);

const close = cva<{ size?: TabsSize }>(
    [
        'nd-tabs-tab-close',
        'inline-flex',
        'shrink-0',
        'items-center',
        'justify-center',
        'rounded-sm',
        'border-0',
        'bg-transparent',
        'cursor-pointer',
        'p-0',
        'text-muted',
        'outline-none',
        'transition-colors',
        'hover:bg-muted-hover',
        'hover:text-brand-hover',
        'focus-visible:ring-focused',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50',
    ],
    {
        variants: {
            size: {
                small: ['size-4', 'text-sm'],
                medium: ['size-4.5', 'text-md'],
                large: ['size-5', 'text-lg'],
            },
        },
    },
);

const panel = cva<{
    orientation?: TabsOrientation;
    variant?: TabsVariant;
}>(['nd-tabs-panel', 'min-w-0', 'outline-none'], {
    variants: {
        orientation: {
            horizontal: '',
            vertical: ['flex-auto'],
        },
        variant: {
            line: '',
            card: ['border', 'border-main', 'bg-panel', 'p-4'],
        },
    },
    compoundVariants: [
        {
            variant: 'line',
            orientation: 'horizontal',
            className: 'pt-4',
        },
        {
            variant: 'line',
            orientation: 'vertical',
            className: 'pt-0',
        },
        {
            variant: 'card',
            orientation: 'horizontal',
            className: ['rounded-b-md', 'rounded-tr-md'],
        },
        {
            variant: 'card',
            orientation: 'vertical',
            className: ['rounded-r-md', 'rounded-bl-md'],
        },
    ],
});

export default {
    tabs,
    list,
    tab,
    tabContent,
    close,
    panel,
};
