/** @type {import('lint-staged').Configuration} */
export default {
    '*.vue': 'prettier --write',
    '*.{js,jsx,ts,tsx}': 'eslint --fix',
    '*.{json,json5,jsonc}': 'prettier --write',
};
