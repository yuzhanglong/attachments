import type { Linter } from 'eslint';

module.exports = {
  extends: [
    '@antfu',
  ],
  ignorePatterns: ['lib', 'esm', 'cjs'],
  rules: {
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/ban-ts-comment': 'off',
  },
} as Linter.Config;
