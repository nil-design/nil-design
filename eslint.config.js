import eslint from '@eslint/js';
import * as tslint from 'typescript-eslint';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tslint.config(
    {
        ignores: ['**/dist/**', '**/node_modules/**', '**/assets/**'],
    },
    eslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
            parserOptions: {
                sourceType: 'module',
                ecmaVersion: 'latest',
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        rules: {
            'no-unused-vars': 'warn',
        },
    },
    importPlugin.flatConfigs.recommended,
    {
        /** only use sorting functionality */
        rules: {
            'import/named': 'off',
            'import/no-unresolved': 'off',
            'import/no-named-as-default': 'off',
            'import/no-named-as-default-member': 'off',
            'import/namespace': 'off',
            'import/default': 'off',
            'import/order': [
                'warn',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'object',
                        'type',
                        'unknown',
                    ],
                    'newlines-between': 'never',
                },
            ],
        },
    },
    react.configs.flat.recommended,
    {
        /** @link https://github.com/facebook/react/issues/28313 */
        plugins: {
            'react-hooks': reactHooks,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react/prop-types': 'off',
            'react/display-name': 'off',
            'react/react-in-jsx-scope': 'off',
        },
    },
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        extends: [tslint.configs.recommended],
        rules: {
            '@typescript-eslint/ban-ts-comment': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-duplicate-enum-values': 'warn',
            '@typescript-eslint/no-unsafe-function-type': 'warn',
            '@typescript-eslint/no-unused-expressions': 'off',
        },
    },
    eslintConfigPrettier,
    eslintPrettierRecommended,
    {
        rules: {
            'prettier/prettier': 'warn',
        },
    },
);
