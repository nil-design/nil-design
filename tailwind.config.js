/** @type {import('tailwindcss').Config} */
export default {
    content: ['./docs/**/*.{md,mdx}', './docs/.vitepress/**/*.{js,jsx,vue}'],
    corePlugins: {
        preflight: false,
    },
    experimental: {
        /** @link https://github.com/tailwindlabs/tailwindcss/discussions/7317 */
        optimizeUniversalDefaults: true,
    },
    theme: {
        extend: {
            textColor: {
                'vp-brand-1': 'var(--vp-c-brand-1)',
                'vp-text-1': 'var(--vp-c-text-1)',
                'vp-info': 'var(--vp-custom-block-info-text)',
                'vp-tip': 'var(--vp-custom-block-tip-text)',
            },
            backgroundColor: {
                'vp-info': 'var(--vp-custom-block-info-bg)',
                'vp-tip': 'var(--vp-custom-block-tip-bg)',
                'vp-danger': 'var(--vp-custom-block-danger-bg)',
            },
        },
    },
};
