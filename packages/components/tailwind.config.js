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
                secondary: 'var(--nd-color-secondary)',
                'secondary-hover': 'var(--nd-color-secondary-hover)',
                'secondary-active': 'var(--nd-color-secondary-active)',
                contrast: 'var(--nd-color-contrast)',
            },
        },
        fontSize: {
            sm: ['var(--nd-font-size-sm)', 'var(--nd-line-height-sm)'],
            md: ['var(--nd-font-size-md)', 'var(--nd-line-height-md)'],
            lg: ['var(--nd-font-size-lg)', 'var(--nd-line-height-lg)'],
            xl: ['var(--nd-font-size-xl)', 'var(--nd-line-height-xl)'],
        },
        borderRadius: {
            sm: 'var(--nd-border-radius-sm)',
            DEFAULT: 'var(--nd-border-radius)',
            lg: 'var(--nd-border-radius-lg)',
        },
    },
};
