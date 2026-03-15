import { RuleTester } from 'eslint';
import * as tseslint from 'typescript-eslint';
import { describe, it } from 'vitest';
import vueParser from 'vue-eslint-parser';
import type { Linter } from 'eslint';

RuleTester.describe = describe;
RuleTester.it = it;

const baseLanguageOptions: Linter.LanguageOptions = {
    ecmaVersion: 'latest' as const,
    sourceType: 'module' as const,
};

const jsLanguageOptions: Linter.LanguageOptions = {
    ...baseLanguageOptions,
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
};

const tsLanguageOptions: Linter.LanguageOptions = {
    ...baseLanguageOptions,
    parser: tseslint.parser as NonNullable<Linter.LanguageOptions['parser']>,
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
};

const vueLanguageOptions: Linter.LanguageOptions = {
    ...baseLanguageOptions,
    parser: vueParser as NonNullable<Linter.LanguageOptions['parser']>,
    parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
    },
};

const ruleTester = new RuleTester({
    languageOptions: baseLanguageOptions,
});

const createTestCase = (
    code: string,
    filename: string,
    languageOptions: Linter.LanguageOptions,
): RuleTester.ValidTestCase => {
    return {
        code,
        filename,
        languageOptions,
    };
};

const asTs = (code: string): RuleTester.ValidTestCase => createTestCase(code, 'test.ts', tsLanguageOptions);

const asTsx = (code: string): RuleTester.ValidTestCase => createTestCase(code, 'test.tsx', tsLanguageOptions);

const asJsx = (code: string): RuleTester.ValidTestCase => createTestCase(code, 'test.jsx', jsLanguageOptions);

const asVue = (code: string): RuleTester.ValidTestCase => createTestCase(code, 'test.vue', vueLanguageOptions);

export { asJsx, asTs, asTsx, asVue, ruleTester };
