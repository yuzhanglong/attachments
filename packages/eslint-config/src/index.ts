import type { Linter } from 'eslint';

module.exports = {
  extends: [
    '@antfu',
    '@antfu/eslint-config-react',
  ],
  ignorePatterns: ['lib', 'esm', 'cjs'],
  rules: {
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    'react/jsx-tag-spacing': 'error',
    'curly': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'no-console': 'warn',
    '@typescript-eslint/brace-style': 'off',
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'semi',
        requireLast: true
      },
      singleline: {
        delimiter: 'semi',
        requireLast: false
      }
    }],
  },
} as Linter.Config;
