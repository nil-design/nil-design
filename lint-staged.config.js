/** @type {import('lint-staged').Configuration} */
export default {
    '*.vue': 'prettier --write',
    '*.{js,jsx,ts,tsx}': 'eslint --fix',
    '*.{css,less}': ['stylelint --fix', 'prettier --write'],
    '*.{json,json5,jsonc}': 'prettier --write',
};
