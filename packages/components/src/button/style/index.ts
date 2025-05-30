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

export type ButtonShape = 'round' | 'square';

export const SHAPE_CLS_MAP: Record<ButtonShape, string[]> = {
    round: ['rounded-full'],
    square: ['rounded-md'],
} as const;

export type ButtonSize = 'small' | 'medium' | 'large';

export const SIZE_CLS_MAP: Record<ButtonSize, Record<'true' | 'false', string[]>> = {
    small: {
        true: ['px-2', 'text-sm', 'h-6'],
        false: ['px-2', 'text-sm', 'py-1'],
    },
    medium: {
        true: ['px-4', 'text-md', 'h-8'],
        false: ['px-4', 'text-md', 'py-1.5'],
    },
    large: {
        true: ['px-6', 'text-lg', 'h-10'],
        false: ['px-6', 'text-lg', 'py-2'],
    },
} as const;

export const EQUAL_CLS_MAP: Record<ButtonSize, string[]> = {
    small: ['w-6 h-6', 'p-1', 'flex justify-center items-center'],
    medium: ['w-8 h-8', 'p-1.5', 'flex justify-center items-center'],
    large: ['w-10 h-10', 'p-2', 'flex justify-center items-center'],
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
