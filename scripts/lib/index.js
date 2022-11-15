const { resolve } = require("node:path");
const { spawnSync } = require("node:child_process");
const { existsSync, statSync, readdirSync, readFileSync } = require("node:fs");
const browserslist = require("browserslist");

/**
 * @returns {string} Returns the absolute path of the root project.
 */
function getRootPath() {
    return resolve(__dirname, "../../");
}

/**
 * @returns {string} Returns the absolute path of the parent directory of each subpackage.
 */
function getPkgsPath() {
    return resolve(getRootPath(), "packages");
}

/**
 * @returns {object} Returns the parsed object from the root package.json.
 */
function getRootPkgCfgs() {
    const rootPkgPath = resolve(getRootPath(), "package.json");
    if (!existsSync(rootPkgPath)) return {};
    return require(rootPkgPath);
}

/**
 * @returns {{
 * dirPath: string;
 * dirName: string;
 * pkgPath: string;
 * pkgCfgs: object
 * }[]} Returns a sequence of subpackage information sorted by dependency topology.
 */
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

/**
 * @param {"development" | "production"} env
 * @returns {object[]} Returns parsed browserslist queries from .browserslistrc.
 */
function getBrowsersList(env = "production") {
    const config =
        browserslist.parseConfig(readFileSync(`${getRootPath()}/.browserslistrc`, { encoding: "utf8" }) || "") || {};
    return config[env] || [];
}

/**
 * @param {string} path
 * @returns {{
 * name: string;
 * email: string;
 * summary: number;
 * }[]} Returns a list of contributors' information.
 */
function getContributors(path = getRootPath()) {
    path = resolve(getRootPath(), path);
    const { stdout } = git(["shortlog", "HEAD", "-sne", ...(path == getRootPath() ? [] : [path])]);
    return (
        stdout.match(/ *\d+\t\S+( <\S+@\S+\.\S+>)?\n/g)?.map(row => ({
            name: /\t\S+/.exec(row)[0].trim(),
            ...(/ <\S+@\S+\.\S+>\n/.test(row)
                ? { email: / <\S+@\S+\.\S+>\n/.exec(row)[0].trim().replace(/[<>]/g, "") }
                : {}),
            summary: Number(/^ *\d+\t/.exec(row)[0].trim()),
        })) || []
    );
}

function git(args = [], options = {}) {
    options = Object.assign({ encoding: "utf8", cwd: getRootPath() }, options);
    return spawnSync("git", args, options);
}

function pnpm(args = [], options = {}) {
    options = Object.assign({ encoding: "utf8", cwd: getRootPath() }, options);
    switch (process.platform) {
        case "win32":
            return spawnSync("pnpm.cmd", args, options);
        default:
            return spawnSync("pnpm", args, options);
    }
}

function npx(args = [], options = {}) {
    options = Object.assign({ encoding: "utf8", cwd: getRootPath() }, options);
    switch (process.platform) {
        case "win32":
            return spawnSync("npx.cmd", args, options);
        default:
            return spawnSync("npx", args, options);
    }
}

function prettier(...files) {
    if (files.length === 0) return;
    return npx(["prettier", "--write", ...files]);
}

function tsc(args = []) {
    return npx(["tsc", ...args]);
}

module.exports = {
    getRootPath,
    getPkgsPath,
    getRootPkgCfgs,
    getSubPkgs,
    getBrowsersList,
    getContributors,
    git,
    pnpm,
    npx,
    prettier,
    tsc,
};
