/**
 * Build all main subpackages' typings
 */
const { relative } = require("node:path");
const { getRootPath, getSubPkgs, tsc } = require("./lib");

const rootPath = getRootPath();
tsc(["-b", ...getSubPkgs().map(({ dirPath }) => relative(rootPath, dirPath))]);
