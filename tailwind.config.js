/** @type {import('tailwindcss').Config} */
export default {
    content: ['./docs/**/*.{md,mdx}', './docs/.vitepress/**/*.{js,jsx,vue}'],
    corePlugins: {
        preflight: false,
    },
};
