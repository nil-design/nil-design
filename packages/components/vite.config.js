import { resolve } from 'path';
import { defineConfig, mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import baseConfig from '../../vite.config.base.js';

export default defineConfig(({ mode }) => {
    return mergeConfig(baseConfig, {
        plugins: [react(), dts({ tsconfigPath: './tsconfig.json' })],
        build: {
            lib: {
                entry: resolve(__dirname, 'src/index.ts'),
                formats: ['es', 'cjs'],
                fileName: format => {
                    switch (format) {
                        case 'es':
                            return 'index.mjs';
                        case 'cjs':
                            return 'index.js';
                        default:
                            return 'index.js';
                    }
                },
            },
            rollupOptions: {
                external: ['react', 'react-dom'],
                output: {
                    globals: {
                        react: 'React',
                        'react-dom': 'ReactDOM',
                    },
                },
            },
            sourcemap: mode === 'DEV',
            minify: mode === 'PROD',
        },
    });
});
