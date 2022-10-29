const { resolve } = require("node:path");
const { spawnSync } = require("node:child_process");
const { existsSync, statSync, readdirSync } = require("node:fs");

function getRootPath() {
    return resolve(__dirname, "../../");
}

function getPkgsPath() {
    return resolve(getRootPath(), "packages");
}

function getRootPkgCfgs() {
    const rootPkgPath = resolve(getRootPath(), "package.json");
    if (!existsSync(rootPkgPath)) return {};
    return require(rootPkgPath);
}

function getSubPkgs() {
    if (!existsSync(getPkgsPath())) return [];
    return readdirSync(getPkgsPath())
        .map(name => {
            const path = resolve(getPkgsPath(), name);
            const pkgPath = resolve(path, "package.json");
            return {
                dirPath: path,
                dirName: name,
                pkgPath,
                pkgCfgs: existsSync(pkgPath) ? require(pkgPath) : {},
            };
        })
        .filter(({ dirPath }) => statSync(dirPath).isDirectory())
        .reduce((pkgs, curPkg) => {
            /* topological sorting */
            let i = pkgs.length - 1;
            if (i < 0) return [curPkg];
            for (; i >= 0; i--) {
                if (Object.keys(curPkg.pkgCfgs.dependencies || {}).includes(pkgs[i].pkgCfgs.name)) {
                    pkgs.splice(i + 1, 0, curPkg);
                    return pkgs;
                }
            }
            pkgs.unshift(curPkg);
            return pkgs;
        }, []);
}

function pnpm(args, options = { cwd: getRootPath() }) {
    return new Promise(resolve => {
        switch (process.platform) {
            case "win32":
                spawnSync("pnpm.cmd", args, options);
                break;
            default:
                spawnSync("pnpm", args, options);
                break;
        }
        resolve();
    });
}

function npx(args, options = { cwd: getRootPath() }) {
    return new Promise(resolve => {
        switch (process.platform) {
            case "win32":
                spawnSync("npx.cmd", args, options);
                break;
            default:
                spawnSync("npx", args, options);
                break;
        }
        resolve();
    });
}

function prettier(...files) {
    if (files.length === 0) return;
    return npx(["prettier", "--write", ...files]);
}

module.exports = {
    getRootPath,
    getPkgsPath,
    getRootPkgCfgs,
    getSubPkgs,
    pnpm,
    npx,
    prettier,
};
