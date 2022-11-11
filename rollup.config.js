const { relative, resolve } = require("node:path");
const { defineConfig } = require("rollup");
const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");
const multiInput = require("rollup-plugin-multi-input").default;
const esbuild = require("rollup-plugin-esbuild").default;
const postcss = require("rollup-plugin-postcss");
// const less = require("rollup-plugin-styles");
const autoprefixer = require("autoprefixer");
const { getRootPath, getSubPkgs, getBrowsersList } = require("./scripts/lib");

const { NODE_ENV } = process.env;
const ignoredPkgs = ["@nild/docs"]; // subpackages that do not be bundled by rollup

module.exports = defineConfig(
    getSubPkgs()
        .filter(({ pkgCfgs }) => !ignoredPkgs.includes(pkgCfgs.name))
        .reduce((configs, { dirPath, pkgCfgs }) => {
            const subPkgRelPath = relative(getRootPath(), dirPath);
            /* common configs */
            const tmplConfig = {
                input: `${subPkgRelPath}/src/index.ts`,
                output: [
                    {
                        file: `${subPkgRelPath}/dist/index.js`,
                        format: "cjs",
                    },
                    {
                        file: `${subPkgRelPath}/dist/index.esm.js`,
                        format: "esm",
                    },
                ],
                plugins: [
                    // multiInput(),
                    commonjs(),
                    esbuild({
                        include: /\.[jt]sx?$/,
                        exclude: /node_modules/,
                        target: "esnext",
                        sourceMap: true,
                        minify: NODE_ENV === "production",
                        jsx: "transform",
                        jsxFactory: "React.createElement",
                        jsxFragment: "React.Fragment",
                        tsconfig: resolve(__dirname, "./tsconfig.json"),
                        loaders: {
                            /** require @rollup/plugin-commonjs */
                            ".json": "json",
                        },
                    }),
                ],
            };

            /* add each as needed */
            switch (pkgCfgs.name) {
                case "@nild/core":
                case "@nild/components":
                    {
                        configs.push(
                            Object.assign({}, tmplConfig, {
                                plugins: [
                                    /** for normalize.css */
                                    nodeResolve({ extensions: [".css"] }),
                                    ...tmplConfig.plugins,
                                    postcss({
                                        extract: false,
                                        minimize: NODE_ENV === "production",
                                        plugins: [
                                            autoprefixer({
                                                env: NODE_ENV,
                                                overrideBrowserslist: getBrowsersList(NODE_ENV),
                                                grid: "autoplace",
                                            }),
                                        ],
                                        extensions: [".css", ".less"],
                                    }),
                                ],
                            })
                        );
                    }
                    break;
                default:
                    configs.push(Object.assign({}, tmplConfig));
                    break;
            }

            return configs;
        }, [])
);
