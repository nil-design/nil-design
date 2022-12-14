/**
 * Delete all directories named dist
 */
const { resolve, relative } = require("node:path");
const { existsSync, rmSync } = require("node:fs");
const { getRootPath, getSubPkgs } = require("./lib");

Promise.all(
    ["dist", "build", "coverage", "tsconfig.tsbuildinfo"]
        .reduce((paths, fileName) => {
            return [
                ...paths,
                `${resolve(getRootPath(), fileName)}`,
                ...getSubPkgs().map(({ dirPath }) => `${dirPath}/${fileName}`),
            ];
        }, [])
        .map(path => {
            return new Promise(_resolve => {
                if (existsSync(path)) {
                    console.log(`removed ${relative(getRootPath(), path)}`);
                    _resolve(rmSync(path, { force: true, recursive: true }));
                }
            });
        })
);
