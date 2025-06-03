import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import getRootDir from './getRootDir.js';

const pkgDirMap = readdirSync(join(getRootDir(), 'packages'), { withFileTypes: true }).reduce((dirMap, dirent) => {
    if (dirent.isDirectory()) {
        const pkgDir = join(getRootDir(), 'packages', dirent.name);
        const pkgJsonPath = join(pkgDir, 'package.json');
        if (existsSync(pkgJsonPath)) {
            const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
            dirMap[pkgJson.name] = pkgDir;
        }
    }
    return dirMap;
}, {});

const getPkgDirMap = () => {
    return pkgDirMap ?? {};
};

export default getPkgDirMap;
