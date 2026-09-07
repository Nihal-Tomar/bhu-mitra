// @bhumitra/config — Shared Prettier Configuration
// All BhuMitra packages use this as their Prettier config

/** @type {import('prettier').Config} */
const config = {
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  endOfLine: 'lf',
  overrides: [
    {
      files: ['*.json', '*.jsonc'],
      options: {
        printWidth: 120,
      },
    },
    {
      files: ['*.md', '*.mdx'],
      options: {
        proseWrap: 'always',
        printWidth: 80,
      },
    },
    {
      files: ['*.yaml', '*.yml'],
      options: {
        singleQuote: false,
      },
    },
  ],
};

module.exports = config;
