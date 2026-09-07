// @bhumitra/config — NestJS ESLint Configuration (ESLint 9 flat config)
const baseConfig = require('./base');

/** @type {import('eslint').Linter.Config[]} */
const nestjsConfig = [
  ...baseConfig,
  {
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

module.exports = nestjsConfig;
