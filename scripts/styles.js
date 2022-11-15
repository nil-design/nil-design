/**
 * Build(Transform) all less styles by postcss
 */
const { resolve, relative, basename, dirname } = require("node:path");
const { existsSync, mkdirSync, readFileSync, writeFileSync } = require("node:fs");
const postcss = require("postcss").default;
const syntax = require("postcss-less");
const autoprefixer = require("autoprefixer");
const postcssImport = require("postcss-import");
const { getRootPath, getSubPkgs, getBrowsersList } = require("./lib/index");

const { NODE_ENV } = process.env;

Promise.all(
    getSubPkgs().map(({ dirPath }) => {
        return new Promise(_resolve => {
            const entryPath = resolve(dirPath, "src/index.less");
            const outputPath = resolve(dirPath, `dist/${basename(entryPath)}`);

            if (!existsSync(entryPath)) return _resolve();
            mkdirSync(dirname(outputPath), { recursive: true });
            postcss([
                postcssImport(),
                autoprefixer({
                    add: true,
                    env: NODE_ENV,
                    overrideBrowserslist: getBrowsersList(NODE_ENV),
                    grid: "autoplace",
                }),
            ])
                .process(readFileSync(entryPath, { encoding: "utf8" }), {
                    syntax,
                    from: relative(getRootPath(), entryPath),
                    to: relative(getRootPath(), outputPath),
                })
                .then(({ content }) => {
                    writeFileSync(outputPath, content, { encoding: "utf8" });
                    _resolve(console.log(`${relative(getRootPath(), outputPath)} generated`));
                });
        });
    })
);
