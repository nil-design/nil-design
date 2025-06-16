import { resolve, basename } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { minifyES } from '../../scripts/plugins';
import { getPeerDeps } from '../../scripts/shared';
import pkg from './package.json';

export default defineConfig(({ mode }) => {
    const peerDeps = getPeerDeps(pkg.name, '@nild/shared');

    return {
        plugins: [react(), dts({ tsconfigPath: './tsconfig.json', copyDtsFiles: true })],
        build: {
            lib: {
                entry: [resolve(__dirname, 'src/index.ts')],
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
                        if (chunkInfo.facadeModuleId.includes('@icon-park/react/es/icons/')) {
                            return `icons/${basename(chunkInfo.facadeModuleId)}`;
                        } else if (chunkInfo.facadeModuleId.includes('@icon-park/react/es/runtime/')) {
                            return 'runtime/index.js';
                        }

                        return '[name].js';
                    },
                    assetFileNames: 'index.css',
                },
            },
        },
    };
});
