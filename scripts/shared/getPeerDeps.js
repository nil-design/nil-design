import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import getPkgDirMap from './getPkgDirMap.js';

const getPeerDeps = (...pkgNames) => {
    const peerDeps = pkgNames.reduce((peerDeps, pkgName) => {
        const pkgDir = getPkgDirMap()[pkgName];
        const pkgJsonPath = join(pkgDir, 'package.json');

        if (existsSync(pkgJsonPath)) {
            const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
            return peerDeps.concat(Object.keys(pkgJson.peerDependencies ?? {}));
        }

        return peerDeps;
    }, []);

    return [...new Set(peerDeps)];
};

export default getPeerDeps;
