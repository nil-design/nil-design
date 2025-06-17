export type SwitchVariant = 'solid' | 'outlined';

export const VARIANT_CLS_MAP: Record<SwitchVariant, string[]> = {
    solid: [''],
    outlined: ['border-solid border border-primary'],
} as const;

export const VARIANT_TRACK_CLS_MAP: Record<SwitchVariant, Record<'true' | 'false', string[]>> = {
    solid: {
        true: ['bg-primary', 'group-enabled:group-hover:bg-primary-hover'],
        false: [
            'bg-[--alpha(var(--color-primary)/40%)]',
            'group-enabled:group-hover:bg-[--alpha(var(--color-primary)/50%)]',
        ],
    },
    outlined: {
        true: ['bg-transparent'],
        false: ['bg-transparent'],
    },
} as const;

export const VARIANT_THUMB_CLS_MAP: Record<SwitchVariant, string[]> = {
    solid: ['bg-contrast', 'top-0'],
    outlined: ['bg-primary', 'group-enabled:group-hover:bg-primary-hover', '-top-[1px]'],
} as const;

export type SwitchSize = 'small' | 'medium' | 'large';

export const SIZE_VAR_MAP: Record<SwitchSize, string> = {
    small: 'calc(var(--spacing) * 4)',
    medium: 'calc(var(--spacing) * 6)',
    large: 'calc(var(--spacing) * 8)',
};

export const SIZE_CLS_MAP: Record<SwitchSize, string[]> = {
    small: ['min-w-8', 'text-sm'],
    medium: ['min-w-10', 'text-md'],
    large: ['min-w-12', 'text-lg'],
};

export type SwitchShape = 'round' | 'square';

export const SHAPE_CLS_MAP: Record<SwitchShape, string[]> = {
    round: ['rounded-full'],
    square: ['rounded-md'],
};
