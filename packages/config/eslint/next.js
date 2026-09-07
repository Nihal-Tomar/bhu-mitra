// @bhumitra/config — Next.js ESLint Configuration (ESLint 9 flat config)
const baseConfig = require('./base');

/** @type {import('eslint').Linter.Config[]} */
const nextConfig = [
  ...baseConfig,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
];

module.exports = nextConfig;
