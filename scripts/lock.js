/**
 * Lock versions of all external dependencies
 */
const { resolve } = require("path");
const { writeFileSync } = require("fs");
const { getRootPath, getRootPkgCfgs, prettier } = require("./lib");

const rootPkgPath = resolve(getRootPath(), "package.json");
const rootPkgCfgs = getRootPkgCfgs();

rootPkgCfgs.devDependencies = {
    ...(rootPkgCfgs.dependencies || {}),
    ...(rootPkgCfgs.devDependencies || {}),
};
delete rootPkgCfgs.dependencies;
Object.keys(rootPkgCfgs.devDependencies).forEach(depName => {
    const depVersion = rootPkgCfgs.devDependencies[depName];
    const matches = depVersion.match(/(\d+\.){2}\d+$/);
    if (matches !== null) {
        console.log(`${depName}: ${depVersion} --> ${matches[0]}`);
        rootPkgCfgs.devDependencies[depName] = `${matches[0]}`;
    }
});

writeFileSync(rootPkgPath, JSON.stringify(rootPkgCfgs), { encoding: "utf8" });
prettier(rootPkgPath);
