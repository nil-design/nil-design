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
};
