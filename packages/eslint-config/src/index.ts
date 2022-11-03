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
  },
} as Linter.Config;
