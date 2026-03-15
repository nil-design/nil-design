/** @type {import('lint-staged').Configuration} */
export default {
    '*.{js,jsx,ts,tsx,vue}': 'eslint --fix',
    '*.{css,less}': ['stylelint --fix', 'prettier --write'],
    '*.{json,json5,jsonc}': 'prettier --write',
};
