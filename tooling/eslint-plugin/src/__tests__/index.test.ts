import { describe, expect, it } from 'vitest';
import plugin, { configs, rules } from '../index';

describe('@nild/eslint-plugin', () => {
    it('should expose a typed plugin scaffold', () => {
        expect(plugin.meta?.name).toBe('@nild/eslint-plugin');
        expect(plugin.rules).toBe(rules);
        expect(plugin.configs).toBe(configs);
    });

    it('should expose a flat recommended config bound to the @nild namespace', () => {
        expect(configs.recommended).toMatchObject({
            files: ['**/*.{js,cjs,mjs,jsx,ts,tsx,vue}'],
            name: '@nild/eslint-plugin/recommended',
            rules: {
                '@nild/boolean-naming': 'warn',
                '@nild/no-hardcoded-colors': 'warn',
            },
        });
        expect(configs.recommended.plugins?.['@nild']).toBe(plugin);
    });
});
