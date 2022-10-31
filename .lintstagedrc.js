module.exports = {
    "*.{js,cjs,mjs,jsx,ts,tsx}": ["eslint --fix"],
    "*.{css,less}": ["stylelint --fix"],
    "*.{json,json5,jsonc,yaml,yml}": ["prettier --write"],
    "*.{md,markdown}": ["markdownlint-cli2", "prettier --write"],
};
