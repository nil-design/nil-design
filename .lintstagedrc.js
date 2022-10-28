module.exports = {
    "*.{js,ts,cjs,mjs}": ["eslint --fix", "prettier --write"],
    "*.{json,json5,jsonc}": ["prettier --write"],
    "*.{yml,yaml}": ["prettier --write"],
    "*.{md,markdown}": ["markdownlint-cli2", "prettier --write"],
};
