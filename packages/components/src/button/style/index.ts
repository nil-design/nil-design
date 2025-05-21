export type ButtonVariant = 'solid' | 'outlined' | 'filled' | 'text';

export const disabledClassNames = [
    'disabled:nd-cursor-not-allowed',
    'disabled:nd-grayscale-[50%]',
    'disabled:nd-opacity-50',
];

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
    small: ['nd-px-2', 'nd-py-1', 'nd-text-sm'],
    medium: ['nd-px-4', 'nd-py-1.5', 'nd-text-md'],
    large: ['nd-px-6', 'nd-py-2', 'nd-text-lg'],
} as const;
