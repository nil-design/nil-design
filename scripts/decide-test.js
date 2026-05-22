#!/usr/bin/env node
/* eslint-disable no-console */
import {
    getChangedFiles,
    getPrBaseFilter,
    getPrDiffRanges,
    isReleasePr,
    printChangedFiles,
    readEvent,
    setOutputs,
} from './shared/ci/index.js';

const eventName = process.env.GITHUB_EVENT_NAME ?? '';
const event = readEvent();
const pr = event.pull_request;

const hasWorkspaceChange = files => files.some(file => /^(packages|tooling)\//.test(file));

const hasGlobalTestChange = files =>
    files.some(file =>
        [
            /^package\.json$/,
            /^pnpm-lock\.yaml$/,
            /^pnpm-workspace\.yaml$/,
            /^tsconfig(\.base)?\.json$/,
            /^eslint\.config\.js$/,
            /^vitest\.config\.[cm]?js$/,
            /^vite\.config\.[cm]?js$/,
            /^scripts\//,
            /^locales\//,
            /^\.github\/workflows\/test\.ya?ml$/,
        ].some(pattern => pattern.test(file)),
    );

if (eventName === 'workflow_dispatch') {
    setOutputs({
        mode: 'full',
        reason: 'manual run',
        filter: '',
    });
} else if (isReleasePr(pr)) {
    setOutputs({
        mode: 'skip',
        reason: 'changesets version PR',
        filter: '',
    });
} else {
    let files;

    try {
        files = getChangedFiles(getPrDiffRanges(pr));
    } catch (error) {
        console.log(error.message);

        setOutputs({
            mode: 'full',
            reason: 'changed files unavailable',
            filter: '',
        });
        process.exit(0);
    }

    printChangedFiles(files);

    if (hasGlobalTestChange(files)) {
        setOutputs({
            mode: 'full',
            reason: 'global CI or tooling input changed',
            filter: '',
        });
    } else if (hasWorkspaceChange(files)) {
        setOutputs({
            mode: 'affected',
            reason: 'workspace package changed',
            filter: getPrBaseFilter(pr),
        });
    } else {
        setOutputs({
            mode: 'skip',
            reason: 'no package test inputs changed',
            filter: '',
        });
    }
}
