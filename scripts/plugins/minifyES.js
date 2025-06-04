import { transform } from 'esbuild';

/**
 * Minify ES modules
 * @link https://github.com/vitejs/vite/issues/6555
 * @returns {import('rollup').Plugin}
 */
const minifyES = () => {
    return {
        name: 'minifyES',
        renderChunk: {
            order: 'post',
            async handler(code, chunk, outputOptions) {
                if (outputOptions.format === 'es' && chunk.fileName.endsWith('.js')) {
                    return await transform(code, { minify: true });
                }

                return code;
            },
        },
    };
};

export default minifyES;
