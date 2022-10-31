import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const ROOT = "packages/docs";
export default defineConfig({
    root: `${ROOT}/src`,
    plugins: [react()],
    server: {
        fs: {
            strict: true,
        },
    },
    /**
     * using absolute paths can prevent the structure of "packages/docs/src" from being built
     */
    build: {
        outDir: resolve(ROOT, "dist"),
        rollupOptions: {
            input: resolve(ROOT, "src/index.html"),
        },
    },
});
