import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { minifyES } from '../../scripts/plugins';
import { getPeerDeps } from '../../scripts/shared';
import pkg from './package.json';

export default defineConfig(({ mode }) => {
    const peerDeps = getPeerDeps(pkg.name, '@nild/shared');

    return {
        plugins: [dts({ tsconfigPath: './tsconfig.json' })],
        build: {
            lib: {
                entry: resolve(__dirname, 'src/index.ts'),
                formats: ['es'],
            },
            emptyOutDir: true,
            sourcemap: mode === 'DEV',
            minify: mode === 'PROD',
            rollupOptions: {
                external: [...peerDeps],
                plugins: [mode === 'PROD' && minifyES()],
                output: {
                    format: 'es',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    entryFileNames: '[name].js',
                },
            },
        },
    };
});
