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

const hasGlobalBenchmarkChange = files =>
    files.some(file =>
        [
            /^package\.json$/,
            /^pnpm-lock\.yaml$/,
            /^pnpm-workspace\.yaml$/,
            /^tsconfig\.base\.json$/,
            /^vitest\.config\.[cm]?[jt]s$/,
            /^scripts\/decide-benchmark\.js$/,
            /^scripts\/shared\/ci\//,
            /^\.github\/workflows\/benchmark\.ya?ml$/,
        ].some(pattern => pattern.test(file)),
    );

const hasPackageBenchmarkChange = (files, packageName) => {
    const packageRoot = `packages/${packageName}/`;

    return files.some(file => {
        if (!file.startsWith(packageRoot)) return false;

        const packagePath = file.slice(packageRoot.length);

        if (/^(package\.json|tsconfig\.json|vite\.config\.[cm]?[jt]s)$/.test(packagePath)) return true;
        if (!packagePath.startsWith('src/')) return false;
        if (/\/__tests__\//.test(packagePath) || /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(packagePath)) return false;

        return /\.[cm]?[jt]sx?$/.test(packagePath) && !packagePath.endsWith('.d.ts');
    });
};

const getBenchmarkScope = files => {
    if (hasGlobalBenchmarkChange(files)) return { components: true, hooks: true, shared: true };

    const shared = hasPackageBenchmarkChange(files, 'shared');
    const hooks = shared || hasPackageBenchmarkChange(files, 'hooks');
    const components = hooks || hasPackageBenchmarkChange(files, 'components');

    return { components, hooks, shared };
};

const setDecision = ({ components, hooks, shared, reason }) =>
    setOutputs({
        run: components || hooks || shared ? 'true' : 'false',
        components: components ? 'true' : 'false',
        hooks: hooks ? 'true' : 'false',
        shared: shared ? 'true' : 'false',
        reason,
    });

const setFullDecision = reason => setDecision({ components: true, hooks: true, shared: true, reason });

if (eventName === 'workflow_dispatch') {
    setFullDecision('manual run');
} else if (isReleasePr(pr)) {
    setDecision({ components: false, hooks: false, shared: false, reason: 'changesets version PR' });
} else {
    let files;

    try {
        files = getChangedFiles(getPrDiffRanges(pr));
    } catch (error) {
        console.log(error.message);
        setFullDecision('changed files unavailable');
        process.exit(0);
    }

    printChangedFiles(files);

    const { components, hooks, shared } = getBenchmarkScope(files);

    if (hasGlobalBenchmarkChange(files)) {
        setFullDecision('global benchmark input changed');
    } else {
        const selected = [components && 'components', hooks && 'hooks', shared && 'shared'].filter(Boolean);

        setDecision({
            components,
            hooks,
            shared,
            reason: selected.length ? `${selected.join(', ')} benchmark inputs changed` : 'no benchmark inputs changed',
        });
    }
}
