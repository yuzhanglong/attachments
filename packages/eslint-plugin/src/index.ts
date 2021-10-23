import ESLint from 'eslint';
import { rules } from './rules';

module.exports = {
  configs: {
    recommended: {
      parser: '@typescript-eslint/parser',
      env: {
        node: true,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      plugins: ['@typescript-eslint', 'jest', 'prettier', 'react'],
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'eslint-config-prettier',
        'plugin:jest/recommended',
        'plugin:prettier/recommended',
      ],
      rules: rules,
    },
  },
} as ESLint.ESLint.Options;
