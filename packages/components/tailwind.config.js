import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
    prefix: 'nd-',
    content: ['./src/**/*.{ts,tsx}'],
    corePlugins: {
        preflight: true,
    },
    experimental: {
        /** @link https://github.com/tailwindlabs/tailwindcss/discussions/7317 */
        optimizeUniversalDefaults: true,
    },
    theme: {
        extend: {
            colors: {
                primary: 'var(--nd-color-primary)',
                'primary-hover': 'var(--nd-color-primary-hover)',
                'primary-active': 'var(--nd-color-primary-active)',
                'primary-mark': 'var(--nd-color-primary-mark)',
                secondary: 'var(--nd-color-secondary)',
                'secondary-hover': 'var(--nd-color-secondary-hover)',
                'secondary-active': 'var(--nd-color-secondary-active)',
                contrast: 'var(--nd-color-contrast)',
            },
            textColor: {
                primary: 'var(--nd-text-color-primary)',
                secondary: 'var(--nd-text-color-secondary)',
            },
            fontSize: {
                sm: ['var(--nd-font-size-sm)', 'var(--nd-line-height-sm)'],
                md: ['var(--nd-font-size-md)', 'var(--nd-line-height-md)'],
                lg: ['var(--nd-font-size-lg)', 'var(--nd-line-height-lg)'],
                xl: ['var(--nd-font-size-xl)', 'var(--nd-line-height-xl)'],
                '2xl': ['var(--nd-font-size-2xl)', 'var(--nd-line-height-2xl)'],
                '3xl': ['var(--nd-font-size-3xl)', 'var(--nd-line-height-3xl)'],
                '4xl': ['var(--nd-font-size-4xl)', 'var(--nd-line-height-4xl)'],
                '5xl': ['var(--nd-font-size-5xl)', 'var(--nd-line-height-5xl)'],
            },
            borderRadius: {
                sm: 'var(--nd-border-radius-sm)',
                DEFAULT: 'var(--nd-border-radius)',
                lg: 'var(--nd-border-radius-lg)',
            },
        },
    },
    plugins: [
        plugin(({ addVariant }) => {
            /** with prefix: nd-disabled */
            addVariant('disabled', ['&.disabled', '&:disabled']);
        }),
    ],
};
