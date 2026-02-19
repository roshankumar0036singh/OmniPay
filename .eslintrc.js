module.exports = {
    root: true,
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    ignorePatterns: ["node_modules", "dist", ".plasmo"],
    env: {
        node: true,
        browser: true,
        es2022: true
    }
}
