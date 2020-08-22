module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:react/recommended',
        'plugin:compat/recommended',
        'plugin:unicorn/recommended',
        'plugin:react-perf/recommended',
        'plugin:react-hooks/recommended',
    ],
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 7,
        sourceType: 'module',
        ecmaFeatures: { jsx: true, modules: true },
    },
    env: {
        es6: true,
        browser: true,
        jquery: true,
        commonjs: true,
    },
    globals: {
        __VERSION__: true,
        __DEVELOPMENT__: true,
        __PRODUCTION__: true,
    },
    plugins: ['prettier', 'react', 'import'],
    rules: {
        'prettier/prettier': 'error',
        'unicorn/no-null': 0,
        'unicorn/filename-case': 0,
    },
    settings: {
        react: {
            version: '16',
        },
    },
};
