export type ButtonVariant = 'solid' | 'outlined' | 'filled' | 'text';

export const VARIANT_CLS_MAP: Record<ButtonVariant, string[]> = {
    solid: ['bg-primary', 'text-contrast', 'enabled:hover:bg-primary-hover', 'enabled:active:bg-primary-active'],
    outlined: [
        'bg-transparent',
        'border-solid',
        'border',
        'border-primary',
        'text-primary',
        'enabled:hover:bg-secondary-hover',
        'enabled:active:bg-secondary-active',
    ],
    filled: ['bg-secondary', 'text-primary', 'enabled:hover:bg-secondary-hover', 'enabled:active:bg-secondary-active'],
    text: ['bg-transparent', 'text-primary', 'enabled:hover:bg-secondary-hover', 'enabled:active:bg-secondary-active'],
} as const;

export type ButtonSize = 'small' | 'medium' | 'large';

export const SIZE_CLS_MAP: Record<ButtonSize, string[]> = {
    small: ['px-2', 'text-sm'],
    medium: ['px-4', 'text-md'],
    large: ['px-6', 'text-lg'],
} as const;

export type ButtonGroupDirection = 'horizontal' | 'vertical';

export const GROUP_FIRST_CLS_MAP: Record<ButtonGroupDirection, string[]> = {
    horizontal: ['rounded-r-none'],
    vertical: ['rounded-b-none'],
} as const;

export const GROUP_LAST_CLS_MAP: Record<ButtonGroupDirection, string[]> = {
    horizontal: ['rounded-l-none'],
    vertical: ['rounded-t-none'],
} as const;

export const GROUP_DIVIDER_CLS_MAP: Record<ButtonGroupDirection, Record<ButtonVariant, string[]>> = {
    horizontal: {
        solid: ['border-solid', 'border-r', 'border-r-primary-hover'],
        outlined: [],
        filled: ['border-solid', 'border-r', 'border-r-secondary-hover'],
        text: ['border-solid', 'border-r', 'border-r-secondary-hover'],
    },
    vertical: {
        solid: ['border-solid', 'border-b', 'border-b-primary-hover'],
        outlined: [],
        filled: ['border-solid', 'border-b', 'border-b-secondary-hover'],
        text: ['border-solid', 'border-b', 'border-b-secondary-hover'],
    },
} as const;
