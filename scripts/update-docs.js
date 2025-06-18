import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import matter from 'gray-matter';
import getDocsDir from './shared/getDocsDir.js';
import getPkgDirMap from './shared/getPkgDirMap.js';

/**
 * TODO
 */
const updateAPIs = () => {};

const updateChangelogs = (locales = ['zh-CN', 'en-US']) => {
    const docsDir = getDocsDir();
    const pkgDirMap = getPkgDirMap();

    locales.forEach(locale => {
        const changelogDir = join(docsDir, locale, 'changelog');

        if (!existsSync(changelogDir)) mkdirSync(changelogDir, { recursive: true });

        Object.entries(pkgDirMap).forEach(([pkgName, pkgDir]) => {
            const changelogPath = join(pkgDir, 'CHANGELOG.md');

            if (!existsSync(changelogPath)) return;

            const dirName = basename(pkgDir);
            const { content } = matter.read(join(pkgDir, 'CHANGELOG.md'));
            const newContent = matter.stringify(content, { title: pkgName });

            writeFileSync(join(changelogDir, `${dirName}.md`), newContent);
        });
    });
};

updateAPIs();
updateChangelogs();
