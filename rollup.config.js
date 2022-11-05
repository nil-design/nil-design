const { relative } = require("node:path");
const { defineConfig } = require("rollup");
const json = require("@rollup/plugin-json");
const commonjs = require("@rollup/plugin-commonjs");
const typescript = require("rollup-plugin-typescript2");
const postcss = require("rollup-plugin-postcss");
const { terser } = require("rollup-plugin-terser");
const autoprefixer = require("autoprefixer");
const { getRootPath, getSubPkgs, getBrowsersList } = require("./scripts/lib");

const { NODE_ENV } = process.env;
const ignoredPkgs = ["@nild/docs"]; // subpackages that do not be bundled by rollup

module.exports = defineConfig(
    getSubPkgs()
        .filter(({ pkgCfgs }) => !ignoredPkgs.includes(pkgCfgs.name))
        .map(({ dirPath, pkgCfgs }) => {
            const subPkgRelPath = relative(getRootPath(), dirPath);
            /* common configs */
            let config = {
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
                    json(),
                    commonjs(),
                    typescript({
                        tsconfig: "tsconfig.json",
                        tsconfigOverride: {
                            compilerOptions: {
                                rootDir: `${subPkgRelPath}/src`,
                            },
                            include: ["types/**/*.d.ts", `${subPkgRelPath}/src/**/*.ts`],
                            exclude: [`${subPkgRelPath}/src/**/*.test.ts`],
                        },
                    }),
                    terser(),
                ],
            };

            /* add each as needed */
            switch (pkgCfgs.name) {
                case "@nild/components":
                    {
                        config.plugins.push(
                            ...[
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
                            ]
                        );
                    }
                    break;
                default:
                    break;
            }

            return config;
        })
);
