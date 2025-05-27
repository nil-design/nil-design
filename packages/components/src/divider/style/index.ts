export type DividerVariant = 'solid' | 'dashed' | 'dotted';

export type DividerDirection = 'horizontal' | 'vertical';

const dWTCCommonClassNames: Record<DividerDirection, string[]> = {
    horizontal: ['w-full min-w-full', 'border-b', 'my-6'],
    vertical: ['inline-block', 'h-[1em]', 'align-middle', 'border-r', 'ms-3 me-3'],
};

export const directionWithoutChildrenClassNames: Record<DividerDirection, Record<DividerVariant, string[]>> = {
    horizontal: {
        solid: dWTCCommonClassNames['horizontal'].concat('border-solid'),
        dashed: dWTCCommonClassNames['horizontal'].concat('border-dashed'),
        dotted: dWTCCommonClassNames['horizontal'].concat('border-dotted'),
    },
    vertical: {
        solid: dWTCCommonClassNames['vertical'].concat('border-solid'),
        dashed: dWTCCommonClassNames['vertical'].concat('border-dashed'),
        dotted: dWTCCommonClassNames['vertical'].concat('border-dotted'),
    },
};

const dWCCommonClassNames: Record<DividerDirection, string[]> = {
    horizontal: [
        'flex items-center text-center',
        'before:h-0 before:content-[""] before:border-b before:border-[color:inherit]',
        'after:h-0 after:content-[""] after:border-b after:border-[color:inherit]',
        'my-6',
    ],
    vertical: [],
};

export const directionWithChildrenClassNames: Record<DividerDirection, Record<DividerVariant, string[]>> = {
    horizontal: {
        solid: dWCCommonClassNames['horizontal'].concat(['before:border-solid', 'after:border-solid']),
        dashed: dWCCommonClassNames['horizontal'].concat(['before:border-dashed', 'after:border-dashed']),
        dotted: dWCCommonClassNames['horizontal'].concat(['before:border-dotted', 'after:border-dotted']),
    },
    vertical: {
        solid: [],
        dashed: [],
        dotted: [],
    },
};

export type DividerAlign = 'left' | 'center' | 'right';

export const alignClassNames: Record<DividerAlign, string[]> = {
    left: ['before:basis-1/12 before:grow-0', 'after:flex-1'],
    center: ['before:flex-1', 'after:flex-1'],
    right: ['before:flex-1', 'after:basis-1/12 after:grow-0'],
};
