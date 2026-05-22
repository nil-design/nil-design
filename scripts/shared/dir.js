import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '../../');
const docsDir = resolve(rootDir, 'docs');
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

const getDocsDir = () => {
    return docsDir;
};

const getPkgDirMap = () => {
    return pkgDirMap ?? {};
};

const getRootDir = () => {
    return rootDir;
};

export { getDocsDir, getPkgDirMap, getRootDir };
export default getRootDir;
