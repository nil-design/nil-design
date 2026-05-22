#!/usr/bin/env node
/* eslint-disable no-console */
import {
    getChangedFiles,
    getPrDiffRanges,
    isReleasePr,
    printChangedFiles,
    readEvent,
    setOutputs,
} from './shared/ci/index.js';

const eventName = process.env.GITHUB_EVENT_NAME ?? '';
const event = readEvent();
const pr = event.pull_request;

const hasChangeset = files => files.some(file => /^\.changeset\/(?!config\.json$).+\.md$/.test(file));

const hasDeployChange = files =>
    files.some(file =>
        [
            /^docs\//,
            /^(packages|tooling)\//,
            /^scripts\//,
            /^locales\//,
            /^package\.json$/,
            /^pnpm-lock\.yaml$/,
            /^pnpm-workspace\.yaml$/,
            /^tsconfig(\.base)?\.json$/,
            /^\.github\/workflows\/deploy\.ya?ml$/,
        ].some(pattern => pattern.test(file)),
    );

if (eventName === 'workflow_dispatch') {
    setOutputs({
        should_deploy: 'true',
        reason: 'manual run',
    });
} else if (!pr?.merged) {
    setOutputs({
        should_deploy: 'false',
        reason: 'pull request was closed without merge',
    });
} else {
    let files;

    try {
        files = getChangedFiles(getPrDiffRanges(pr, { deploy: true }));
    } catch (error) {
        console.log(error.message);

        setOutputs({
            should_deploy: 'true',
            reason: 'changed files unavailable',
        });
        process.exit(0);
    }

    printChangedFiles(files);

    if (!isReleasePr(pr) && hasChangeset(files)) {
        setOutputs({
            should_deploy: 'false',
            reason: 'changeset PR will be followed by the version PR',
        });
    } else {
        setOutputs({
            should_deploy: hasDeployChange(files) ? 'true' : 'false',
            reason: hasDeployChange(files) ? 'deploy inputs changed' : 'no deploy inputs changed',
        });
    }
}
