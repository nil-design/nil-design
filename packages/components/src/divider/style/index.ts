export type DividerVariant = 'solid' | 'dashed' | 'dotted';

export type DividerDirection = 'horizontal' | 'vertical';

const dWTCCommonClassNames: Record<DividerDirection, string[]> = {
    horizontal: ['nd-w-full nd-min-w-full', 'nd-border-b', 'nd-my-6'],
    vertical: ['nd-inline-block', 'nd-h-[1em]', 'nd-align-middle', 'nd-border-r', 'nd-ms-3 nd-me-3'],
};

export const directionWithoutChildrenClassNames: Record<DividerDirection, Record<DividerVariant, string[]>> = {
    horizontal: {
        solid: dWTCCommonClassNames['horizontal'].concat('nd-border-solid'),
        dashed: dWTCCommonClassNames['horizontal'].concat('nd-border-dashed'),
        dotted: dWTCCommonClassNames['horizontal'].concat('nd-border-dotted'),
    },
    vertical: {
        solid: dWTCCommonClassNames['vertical'].concat('nd-border-solid'),
        dashed: dWTCCommonClassNames['vertical'].concat('nd-border-dashed'),
        dotted: dWTCCommonClassNames['vertical'].concat('nd-border-dotted'),
    },
};

const dWCCommonClassNames: Record<DividerDirection, string[]> = {
    horizontal: [
        'nd-flex nd-items-center nd-text-center',
        'before:nd-h-0 before:nd-content-[""] before:nd-border-b before:nd-border-[color:inherit]',
        'after:nd-h-0 after:nd-content-[""] after:nd-border-b after:nd-border-[color:inherit]',
        'nd-my-6',
    ],
    vertical: [],
};

export const directionWithChildrenClassNames: Record<DividerDirection, Record<DividerVariant, string[]>> = {
    horizontal: {
        solid: dWCCommonClassNames['horizontal'].concat(['before:nd-border-solid', 'after:nd-border-solid']),
        dashed: dWCCommonClassNames['horizontal'].concat(['before:nd-border-dashed', 'after:nd-border-dashed']),
        dotted: dWCCommonClassNames['horizontal'].concat(['before:nd-border-dotted', 'after:nd-border-dotted']),
    },
    vertical: {
        solid: [],
        dashed: [],
        dotted: [],
    },
};

export type DividerAlign = 'left' | 'center' | 'right';

export const alignClassNames: Record<DividerAlign, string[]> = {
    left: ['before:nd-basis-1/12 before:nd-grow-0', 'after:nd-flex-1'],
    center: ['before:nd-flex-1', 'after:nd-flex-1'],
    right: ['before:nd-flex-1', 'after:nd-basis-1/12 after:nd-grow-0'],
};
