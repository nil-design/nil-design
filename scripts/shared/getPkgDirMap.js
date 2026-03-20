import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import getRootDir from './getRootDir.js';

const rootDir = getRootDir();
const workspaceDirs = ['packages', 'tooling'];

const pkgDirMap = workspaceDirs.reduce((dirMap, workspaceDir) => {
    const workspaceDirPath = join(rootDir, workspaceDir);

    if (!existsSync(workspaceDirPath)) {
        return dirMap;
    }

    return readdirSync(workspaceDirPath, { withFileTypes: true }).reduce((workspaceMap, dirent) => {
        if (dirent.isDirectory()) {
            const pkgDir = join(workspaceDirPath, dirent.name);
            const pkgJsonPath = join(pkgDir, 'package.json');

            if (existsSync(pkgJsonPath)) {
                const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));

                workspaceMap[pkgJson.name] = pkgDir;
            }
        }

        return workspaceMap;
    }, dirMap);
}, {});

const getPkgDirMap = () => {
    return pkgDirMap ?? {};
};

export default getPkgDirMap;
