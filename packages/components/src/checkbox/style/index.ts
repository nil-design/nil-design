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

export const INDICATOR_CHECKED_CLS_MAP = {
    true: ['bg-primary text-contrast', 'group-enabled:group-hover:bg-primary-hover'],
    false: ['bg-transparent text-transparent', 'group-enabled:group-hover:bg-tertiary-hover'],
} as const;
