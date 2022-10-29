/**
 * Delete all directories named dist
 */
const { resolve, relative } = require("path");
const { existsSync, rmSync } = require("fs");
const { getRootPath, getSubPkgs } = require("./lib");

Promise.all(
    ["dist", "build", "coverage"]
        .reduce((paths, fileName) => {
            return [
                ...paths,
                `${resolve(getRootPath(), fileName)}`,
                ...getSubPkgs().map(({ dirPath }) => `${dirPath}/${fileName}`),
            ];
        }, [])
        .map(path => {
            return new Promise(resolve => {
                if (existsSync(path)) {
                    console.log(`removed ${relative(getRootPath(), path)}`);
                    resolve(rmSync(path, { force: true, recursive: true }));
                }
            });
        })
);
