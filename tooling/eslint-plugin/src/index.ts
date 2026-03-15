import createRecommendedConfig from './configs/recommended';
import rules from './rules';
import type { ESLint } from 'eslint';

const plugin: ESLint.Plugin = {
    meta: {
        name: '@nild/eslint-plugin',
    },
    rules,
    configs: {},
};

const configs = {
    recommended: createRecommendedConfig(plugin),
};

plugin.configs = configs;

export { configs, rules };
export default plugin;
