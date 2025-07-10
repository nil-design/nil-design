export type CheckboxVariant = 'solid' | 'outlined';

export const INDICATOR_VARIANT_CLS_MAP: Record<CheckboxVariant, Record<'true' | 'false', string[]>> = {
    solid: {
        true: ['bg-primary text-contrast', 'group-enabled:group-hover:bg-primary-hover'],
        false: ['bg-transparent text-transparent', 'group-enabled:group-hover:bg-tertiary-hover'],
    },
    outlined: {
        true: ['bg-transparent text-primary', 'group-enabled:group-hover:bg-tertiary-hover'],
        false: ['bg-transparent text-transparent', 'group-enabled:group-hover:bg-tertiary-hover'],
    },
} as const;

export type CheckboxSize = 'small' | 'medium' | 'large';

export const SIZE_CLS_MAP: Record<CheckboxSize, Record<'wrapper' | 'indicator' | 'label', string>> = {
    small: {
        wrapper: 'gap-1.5',
        indicator: 'w-3.5 h-3.5 text-sm',
        label: 'text-sm',
    },
    medium: {
        wrapper: 'gap-2',
        indicator: 'w-4 h-4 text-md',
        label: 'text-md',
    },
    large: {
        wrapper: 'gap-2.5',
        indicator: 'w-4.5 h-4.5 text-xl',
        label: 'text-lg',
    },
} as const;
