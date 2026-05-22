#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { RELEASE_PR_TITLE, RELEASE_PR_TITLE_PREFIX, setOutputs } from './shared/ci/index.js';

const RELEASE_TYPE_RANK = new Map([
    ['patch', 1],
    ['minor', 2],
    ['major', 3],
]);
const MAX_TITLE_LENGTH = 100;

const changesetDir = process.env.CHANGESET_DIR ?? '.changeset';

const getChangesetFiles = () => {
    if (!existsSync(changesetDir)) return [];

    return readdirSync(changesetDir)
        .filter(file => file.endsWith('.md'))
        .map(file => join(changesetDir, file));
};

const addRelease = (releases, packageName, releaseType) => {
    const normalizedType = String(releaseType).toLowerCase();
    const rank = RELEASE_TYPE_RANK.get(normalizedType);

    if (!rank) return;

    const currentType = releases.get(packageName);
    const currentRank = RELEASE_TYPE_RANK.get(currentType) ?? 0;

    if (rank > currentRank) {
        releases.set(packageName, normalizedType);
    }
};

const getReleases = () => {
    const releases = new Map();

    for (const file of getChangesetFiles()) {
        const { data } = matter(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));

        Object.entries(data).forEach(([packageName, releaseType]) => {
            addRelease(releases, packageName, releaseType);
        });
    }

    return Array.from(releases, ([packageName, releaseType]) => ({
        packageName,
        releaseType,
    })).sort((a, b) => {
        const rankDiff = RELEASE_TYPE_RANK.get(b.releaseType) - RELEASE_TYPE_RANK.get(a.releaseType);

        return rankDiff || a.packageName.localeCompare(b.packageName);
    });
};

const formatTitle = releases => {
    if (!releases.length) return RELEASE_PR_TITLE;

    const items = releases.map(({ packageName, releaseType }) => `${packageName} ${releaseType}`);

    for (let visibleCount = items.length; visibleCount > 0; visibleCount -= 1) {
        const visibleItems = items.slice(0, visibleCount).join(', ');
        const hiddenCount = items.length - visibleCount;
        const suffix = hiddenCount ? ` +${hiddenCount} more` : '';
        const title = `${RELEASE_PR_TITLE_PREFIX} ${visibleItems}${suffix}`;

        if (title.length <= MAX_TITLE_LENGTH || visibleCount === 1) return title;
    }

    return RELEASE_PR_TITLE;
};

setOutputs({
    title: formatTitle(getReleases()),
});
