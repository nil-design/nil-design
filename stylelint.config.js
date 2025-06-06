/** @type {import('stylelint').Config} */
export default {
    extends: ['stylelint-config-standard'],
    rules: {
        'at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: ['theme', 'utility', 'custom-variant', 'slot', 'source'],
            },
        ],
        'at-rule-no-deprecated': [true, { ignoreAtRules: ['apply'] }],
        'color-hex-length': 'long',
        'custom-property-empty-line-before': null,
        'custom-property-pattern': null,
        'import-notation': null,
        'selector-class-pattern': null,
    },
};
