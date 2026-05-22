import { builtinModules } from 'module';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { minifyES } from '../../scripts/plugins';
import getPeerDeps from '../../scripts/shared/deps.js';
import pkg from './package.json';

export default defineConfig(({ mode }) => {
    const peerDeps = getPeerDeps(pkg.name);
    const nodeBuiltins = builtinModules.flatMap(moduleName => [moduleName, `node:${moduleName}`]);

    return {
        plugins: [
            dts({
                tsconfigPath: './tsconfig.json',
                include: ['src'],
                exclude: ['src/**/__tests__/**', 'src/**/*.test.ts', 'src/**/*.test.tsx'],
                copyDtsFiles: true,
            }),
        ],
        build: {
            lib: {
                entry: [resolve(__dirname, 'src/index.ts'), resolve(__dirname, 'src/interfaces/schema.ts')],
                formats: ['es'],
            },
            emptyOutDir: true,
            sourcemap: mode === 'DEV',
            minify: mode === 'PROD',
            rollupOptions: {
                external: [...peerDeps, ...nodeBuiltins],
                plugins: [minifyES(mode === 'PROD')],
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
