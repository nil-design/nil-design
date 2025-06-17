import { resolve, basename } from 'path';
import react from '@vitejs/plugin-react';
import postcssNested from 'postcss-nested';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { minifyES } from '../../scripts/plugins';
import { getPeerDeps } from '../../scripts/shared';
import pkg from './package.json';

export default defineConfig(({ mode }) => {
    const peerDeps = getPeerDeps(pkg.name, '@nild/shared', '@nild/hooks');

    return {
        plugins: [react(), dts({ tsconfigPath: './tsconfig.json' })],
        css: {
            postcss: {
                plugins: [postcssNested],
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
                plugins: [minifyES(mode === 'PROD')],
                output: {
                    format: 'es',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    entryFileNames: chunkInfo => {
                        if (chunkInfo.facadeModuleId.includes('@floating-ui/')) {
                            return `_lib/${basename(chunkInfo.facadeModuleId, '.mjs')}.js`;
                        }

                        return '[name].js';
                    },
                    assetFileNames: 'tailwind.css',
                },
            },
        },
    };
});
