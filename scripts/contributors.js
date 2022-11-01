/**
 * Count contributors across the project and across subpackages
 */
const { writeFileSync, existsSync } = require("node:fs");
const { getRootPath, getSubPkgs, getContributors, prettier } = require("./lib");

const filesNeeded2BeFormatted = [];

Promise.all(
    [getRootPath(), ...getSubPkgs().map(({ dirPath }) => dirPath)].map(dirPath => {
        return new Promise(_resolve => {
            const pkgPath = `${dirPath}/package.json`;
            const contributors = getContributors(dirPath).map(({ name, email }) => ({ name, email }));
            if (existsSync(pkgPath)) {
                writeFileSync(pkgPath, JSON.stringify(Object.assign(require(pkgPath), { contributors })), {
                    encoding: "utf8",
                });
                filesNeeded2BeFormatted.push(pkgPath);
            }
            _resolve();
        });
    })
).then(() => {
    prettier(...filesNeeded2BeFormatted);
});
