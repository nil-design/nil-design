export type ButtonVariant = 'solid' | 'outlined' | 'filled' | 'text';

export const variantClassNames: Record<ButtonVariant, string[]> = {
    solid: [
        'nd-bg-primary',
        'nd-text-contrast',
        'enabled:hover:nd-bg-primary-hover',
        'enabled:active:nd-bg-primary-active',
    ],
    outlined: [
        'nd-bg-transparent',
        'nd-border-solid',
        'nd-border',
        'nd-border-primary',
        'nd-text-primary',
        'enabled:hover:nd-bg-secondary-hover',
        'enabled:active:nd-bg-secondary-active',
    ],
    filled: [
        'nd-bg-secondary',
        'nd-text-primary',
        'enabled:hover:nd-bg-secondary-hover',
        'enabled:active:nd-bg-secondary-active',
    ],
    text: [
        'nd-bg-transparent',
        'nd-text-primary',
        'enabled:hover:nd-bg-secondary-hover',
        'enabled:active:nd-bg-secondary-active',
    ],
} as const;

export type ButtonSize = 'small' | 'medium' | 'large';

export const sizeClassNames: Record<ButtonSize, string[]> = {
    small: ['nd-px-2', 'nd-text-sm'],
    medium: ['nd-px-4', 'nd-text-md'],
    large: ['nd-px-6', 'nd-text-lg'],
} as const;

export type ButtonGroupDirection = 'horizontal' | 'vertical';

export const groupFirstClassNames: Record<ButtonGroupDirection, string[]> = {
    horizontal: ['nd-rounded-r-none'],
    vertical: ['nd-rounded-b-none'],
} as const;

export const groupLastClassNames: Record<ButtonGroupDirection, string[]> = {
    horizontal: ['nd-rounded-l-none'],
    vertical: ['nd-rounded-t-none'],
} as const;

export const groupDividerClassNames: Record<ButtonGroupDirection, Record<ButtonVariant, string[]>> = {
    horizontal: {
        solid: ['nd-border-solid', 'nd-border-r', 'nd-border-r-primary-hover'],
        outlined: [],
        filled: ['nd-border-solid', 'nd-border-r', 'nd-border-r-secondary-hover'],
        text: ['nd-border-solid', 'nd-border-r', 'nd-border-r-secondary-hover'],
    },
    vertical: {
        solid: ['nd-border-solid', 'nd-border-b', 'nd-border-b-primary-hover'],
        outlined: [],
        filled: ['nd-border-solid', 'nd-border-b', 'nd-border-b-secondary-hover'],
        text: ['nd-border-solid', 'nd-border-b', 'nd-border-b-secondary-hover'],
    },
} as const;
