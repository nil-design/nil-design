import rules from '../rules';
import type { ESLint, Linter } from 'eslint';

const createRecommendedConfig = (plugin: ESLint.Plugin): Linter.Config => {
    const recommendedRules = Object.keys(rules).reduce<Record<string, Linter.RuleEntry>>((config, ruleName) => {
        config[`@nild/${ruleName}`] = 'warn';

        return config;
    }, {});

    return {
        name: '@nild/eslint-plugin/recommended',
        files: ['**/*.{js,cjs,mjs,jsx,ts,tsx,vue}'],
        plugins: {
            '@nild': plugin,
        },
        rules: recommendedRules,
    };
};

export default createRecommendedConfig;
