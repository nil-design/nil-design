import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            exclude: ['**/__tests__/**'],
        },
    },
});
