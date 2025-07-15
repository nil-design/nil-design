import { cva } from '@nild/shared';
import { DividerProps } from '../interfaces';

export const dividerClassNames = cva<DividerProps & { emptyChildren: boolean }>(
    ['nd-divider', 'border-split', 'text-primary'],
    {
        compoundVariants: [
            {
                emptyChildren: true,
                direction: 'horizontal',
                className: ['w-full', 'min-w-full', 'border-b', 'my-6'],
            },
            {
                emptyChildren: true,
                direction: 'vertical',
                className: ['inline-block', 'h-[1em]', 'align-middle', 'border-r', 'ms-3 me-3'],
            },
            {
                emptyChildren: true,
                variant: 'solid',
                className: ['border-solid'],
            },
            {
                emptyChildren: true,
                variant: 'dashed',
                className: ['border-dashed'],
            },
            {
                emptyChildren: true,
                variant: 'dotted',
                className: ['border-dotted'],
            },
            {
                emptyChildren: false,
                direction: 'horizontal',
                className: [
                    'flex items-center text-center',
                    'before:h-0 before:content-[""] before:border-b before:border-[color:inherit]',
                    'after:h-0 after:content-[""] after:border-b after:border-[color:inherit]',
                    'my-6',
                ],
            },
            {
                emptyChildren: false,
                direction: 'horizontal',
                variant: 'solid',
                className: ['before:border-solid', 'after:border-solid'],
            },
            {
                emptyChildren: false,
                direction: 'horizontal',
                variant: 'dashed',
                className: ['before:border-dashed', 'after:border-dashed'],
            },
            {
                emptyChildren: false,
                direction: 'horizontal',
                variant: 'dotted',
                className: ['before:border-dotted', 'after:border-dotted'],
            },
            {
                emptyChildren: false,
                direction: 'horizontal',
                align: 'left',
                className: ['before:basis-1/12', 'before:grow-0', 'after:flex-1'],
            },
            {
                emptyChildren: false,
                direction: 'horizontal',
                align: 'center',
                className: ['before:flex-1', 'after:flex-1'],
            },
            {
                emptyChildren: false,
                direction: 'horizontal',
                align: 'right',
                className: ['before:flex-1', 'after:basis-1/12', 'after:grow-0'],
            },
        ],
    },
);
