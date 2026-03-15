import booleanNaming from './boolean-naming';
import noHardcodedColors from './no-hardcoded-colors';
import type { Rule } from 'eslint';

const rules = {
    'boolean-naming': booleanNaming,
    'no-hardcoded-colors': noHardcodedColors,
} satisfies Record<string, Rule.RuleModule>;

export default rules;
