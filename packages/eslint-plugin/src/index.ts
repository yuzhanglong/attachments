import { ESLint } from 'eslint';
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
      plugins: ['@typescript-eslint', 'jest', 'prettier', 'react', 'jsdoc'],
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'eslint-config-prettier',
        'plugin:jest/recommended',
        'plugin:prettier/recommended',
        'plugin:jsdoc/recommended',
      ],
      rules: rules,
    },
    settings: {
      jest: {
        version: 27,
      },
    },
  },
} as ESLint.Options;
