export type DividerVariant = 'solid' | 'dashed' | 'dotted';

export type DividerDirection = 'horizontal' | 'vertical';

const H_WITHOUT_CHILDREN_CLS = ['w-full min-w-full', 'border-b', 'my-6'];
const V_WITHOUT_CHILDREN_CLS = ['inline-block', 'h-[1em]', 'align-middle', 'border-r', 'ms-3 me-3'];

export const DIRECTION_WITHOUT_CHILDREN_CLS_MAP: Record<DividerDirection, Record<DividerVariant, string[]>> = {
    horizontal: {
        solid: H_WITHOUT_CHILDREN_CLS.concat('border-solid'),
        dashed: H_WITHOUT_CHILDREN_CLS.concat('border-dashed'),
        dotted: H_WITHOUT_CHILDREN_CLS.concat('border-dotted'),
    },
    vertical: {
        solid: V_WITHOUT_CHILDREN_CLS.concat('border-solid'),
        dashed: V_WITHOUT_CHILDREN_CLS.concat('border-dashed'),
        dotted: V_WITHOUT_CHILDREN_CLS.concat('border-dotted'),
    },
};

const H_WITH_CHILDREN_CLS = [
    'flex items-center text-center',
    'before:h-0 before:content-[""] before:border-b before:border-[color:inherit]',
    'after:h-0 after:content-[""] after:border-b after:border-[color:inherit]',
    'my-6',
];

export const DIRECTION_WITH_CHILDREN_CLS_MAP: Record<DividerDirection, Record<DividerVariant, string[]>> = {
    horizontal: {
        solid: H_WITH_CHILDREN_CLS.concat(['before:border-solid', 'after:border-solid']),
        dashed: H_WITH_CHILDREN_CLS.concat(['before:border-dashed', 'after:border-dashed']),
        dotted: H_WITH_CHILDREN_CLS.concat(['before:border-dotted', 'after:border-dotted']),
    },
    vertical: {
        solid: [],
        dashed: [],
        dotted: [],
    },
};

export type DividerAlign = 'left' | 'center' | 'right';

export const ALIGN_CLS_MAP: Record<DividerAlign, string[]> = {
    left: ['before:basis-1/12 before:grow-0', 'after:flex-1'],
    center: ['before:flex-1', 'after:flex-1'],
    right: ['before:flex-1', 'after:basis-1/12 after:grow-0'],
};
