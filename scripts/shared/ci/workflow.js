/* eslint-disable no-console */
import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync } from 'node:fs';

export const RELEASE_PR_TITLE_PREFIX = 'ci: publish';
export const RELEASE_PR_TITLE = `${RELEASE_PR_TITLE_PREFIX} new versions`;
export const RELEASE_PR_BRANCH_PREFIX = 'changeset-release/';

const normalizePath = path => path.replace(/\\/g, '/');
const sanitizeOutput = value => String(value ?? '').replace(/\r?\n/g, ' ');

export const readEvent = () => {
    const eventPath = process.env.GITHUB_EVENT_PATH;

    if (!eventPath || !existsSync(eventPath)) return {};

    return JSON.parse(readFileSync(eventPath, 'utf8').replace(/^\uFEFF/, ''));
};

export const setOutputs = outputs => {
    const output = Object.entries(outputs)
        .map(([key, value]) => `${key}=${sanitizeOutput(value)}`)
        .join('\n');

    if (process.env.GITHUB_OUTPUT) {
        appendFileSync(process.env.GITHUB_OUTPUT, `${output}\n`);
    }

    console.log(output);
};

export const getChangedFiles = ranges => {
    const errors = [];

    for (const range of ranges.filter(Boolean)) {
        try {
            const output = execFileSync('git', ['diff', '--name-only', range], { encoding: 'utf8' });

            return output.trim().split(/\r?\n/).filter(Boolean).map(normalizePath);
        } catch (error) {
            errors.push(`${range}: ${error.message}`);
        }
    }

    throw new Error(`Unable to read changed files. ${errors.join(' | ')}`);
};

export const getPrDiffRanges = (pr, { deploy = false } = {}) => {
    const baseSha = pr?.base?.sha;
    const baseRef = pr?.base?.ref ?? process.env.GITHUB_BASE_REF;
    const mergeSha = pr?.merge_commit_sha;
    const fallbackBase = baseRef ? `origin/${baseRef}` : undefined;

    if (deploy) {
        return [`${baseSha}..${mergeSha}`, `${baseSha}..HEAD`, fallbackBase && `${fallbackBase}..HEAD`];
    }

    return [`${baseSha}...HEAD`, fallbackBase && `${fallbackBase}...HEAD`];
};

export const getPrBaseFilter = pr => `...[${pr?.base?.sha ?? `origin/${pr?.base?.ref ?? 'main'}`}]`;

export const isReleasePr = pr => {
    const headRef = pr?.head?.ref ?? '';

    return headRef.startsWith(RELEASE_PR_BRANCH_PREFIX);
};

export const printChangedFiles = files => {
    console.log('Changed files:');
    files.forEach(file => console.log(`  ${file}`));
};
