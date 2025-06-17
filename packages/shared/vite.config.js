import { resolve, basename } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { minifyES } from '../../scripts/plugins';
import { getPeerDeps } from '../../scripts/shared';
import pkg from './package.json';

export default defineConfig(({ mode }) => {
    const peerDeps = getPeerDeps(pkg.name);

    return {
        plugins: [
            dts({
                tsconfigPath: './tsconfig.json',
                copyDtsFiles: true,
            }),
        ],
        build: {
            lib: {
                entry: [resolve(__dirname, 'src/index.ts'), resolve(__dirname, 'src/utils/index.ts')],
                formats: ['es'],
            },
            emptyOutDir: true,
            sourcemap: mode === 'DEV',
            minify: mode === 'PROD',
            rollupOptions: {
                external: [...peerDeps],
                plugins: [minifyES(mode === 'PROD')],
                output: {
                    format: 'es',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    entryFileNames: chunkInfo => {
                        if (chunkInfo.facadeModuleId.includes('tailwind-merge/')) {
                            return `_lib/${basename(chunkInfo.facadeModuleId, '.mjs')}.js`;
                        }

                        return '[name].js';
                    },
                },
            },
        },
    };
});
