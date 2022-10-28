module.exports = {
    root: true,
    env: {
        es6: true,
        browser: true,
        node: true,
        jest: true,
    },

    plugins: ["@typescript-eslint"],
    extends: ["eslint:recommended", "plugin:prettier/recommended", "plugin:@typescript-eslint/recommended"],
    globals: {
        AsyncGenerator: true,
        AsyncGeneratorFunction: true,
        BigInt: true,
        BigInt64Array: true,
        BigUint64Array: true,
        RelativeIndexable: true,
        TypedArray: true,
        WeakRef: true,
    },

    parser: "@typescript-eslint/parser",

    rules: {
        "brace-style": ["error", "1tbs", { allowSingleLine: true }],
        "comma-spacing": ["error", { before: false, after: true }],
        "array-bracket-spacing": ["error", "never"],
        "function-paren-newline": "off",
        "no-constant-condition": "off",
        "no-undef": "warn",
        "no-var": "warn",
        "no-unused-vars": "warn",
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",

        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
    },
};
