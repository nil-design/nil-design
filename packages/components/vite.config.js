import { resolve } from 'path';
import { defineConfig } from 'vite';
import postcssImport from 'postcss-import';
import postcssNested from 'postcss-nested';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import pkg from './package.json';

export default defineConfig(({ mode }) => {
    const peerDeps = Object.keys(pkg.peerDependencies || {});

    return {
        plugins: [react(), dts({ tsconfigPath: './tsconfig.json' })],
        css: {
            postcss: {
                plugins: [postcssImport, postcssNested, autoprefixer, tailwindcss],
            },
        },
        build: {
            lib: {
                entry: resolve(__dirname, 'src/index.ts'),
                formats: ['es'],
            },
            emptyOutDir: true,
            sourcemap: mode === 'DEV',
            minify: mode === 'PROD',
            rollupOptions: {
                external: [...peerDeps, 'react/jsx-runtime'],
                output: {
                    format: 'es',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    entryFileNames: '[name].mjs',
                    assetFileNames: '[name].css',
                },
            },
        },
    };
});
