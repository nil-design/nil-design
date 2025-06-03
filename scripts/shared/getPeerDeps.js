import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { has } from 'lodash-es';
import getPkgDirMap from './getPkgDirMap.js';

const getPeerDeps = (...pkgNames) => {
    const pkgDirMap = getPkgDirMap();
    const peerDeps = pkgNames.reduce((peerDeps, pkgName) => {
        const pkgDir = pkgDirMap[pkgName];
        const pkgJsonPath = join(pkgDir, 'package.json');

        if (existsSync(pkgJsonPath)) {
            const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
            return peerDeps.concat(
                Object.keys(pkgJson.peerDependencies ?? {}).map(dep =>
                    has(pkgDirMap, dep) ? new RegExp(`^${dep}/?`) : dep,
                ),
            );
        }

        return peerDeps;
    }, []);

    return [...new Set(peerDeps)];
};

export default getPeerDeps;
