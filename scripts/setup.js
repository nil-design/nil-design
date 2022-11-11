/**
 * Setup the common pkg info and configs for each subpackage.
 */
const { resolve } = require("node:path");
const { existsSync, writeFileSync, readFileSync, mkdirSync } = require("node:fs");
const { getRootPath, getPkgsPath, getRootPkgCfgs, getSubPkgs, prettier } = require("./lib");

const filesNeeded2BeFormatted = [];
const rootPath = getRootPath();
const rootPkgCfgs = getRootPkgCfgs();

mkdirSync(resolve(getPkgsPath(), rootPkgCfgs.scope || rootPkgCfgs.name), { recursive: true });
Promise.all(
    getSubPkgs().map(({ dirPath, dirName, pkgPath: subPkgPath, pkgCfgs: subPkgCfgs }) => {
        return new Promise(_resolve => {
            /* package.json */
            if (!subPkgCfgs.private) {
                Object.assign(subPkgCfgs, {
                    main: "dist/index.js",
                    module: "dist/index.esm.js",
                    typings: "dist/index.d.ts",
                    files: ["dist", "LICENSE", "package.json", "README.md"],
                });
            }
            ["author", "repository", "bugs", "license"].forEach(key => {
                subPkgCfgs[key] = rootPkgCfgs[key];
            });
            if (dirName !== rootPkgCfgs.scope) {
                /* subpackage unique configuration */
                subPkgCfgs["name"] = `@${rootPkgCfgs.scope || rootPkgCfgs.name}/${dirName}`;
                delete subPkgCfgs["scripts"];
            } else {
                /* collection package unique configuration */
                subPkgCfgs["name"] = rootPkgCfgs.scope || rootPkgCfgs.name;
            }
            writeFileSync(subPkgPath, JSON.stringify(subPkgCfgs), { encoding: "utf8" });
            filesNeeded2BeFormatted.push(subPkgPath);
            /* LICENSE */
            if (existsSync(resolve(rootPath, "LICENSE"))) {
                writeFileSync(
                    resolve(dirPath, "LICENSE"),
                    readFileSync(resolve(rootPath, "LICENSE"), { encoding: "utf8" }),
                    {
                        encoding: "utf8",
                    }
                );
            }
            _resolve();
        });
    })
).then(() => {
    prettier(...filesNeeded2BeFormatted);
});
