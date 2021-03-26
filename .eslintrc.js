module.exports = {
  'parser': '@typescript-eslint/parser',
  'extends': [
    'prettier/@typescript-eslint',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@lint-md/recommend',
    'eslint:recommended'
  ],
  overrides: [
    {
      files: ['*.md'],
      parser: '@lint-md/eslint-plugin/src/parser',
      rules: {
        '@lint-md/no-long-code': [2, {
          'length': 1000,
          'exclude': []
        }]
      }
    }
  ],
  'plugins': [
    '@typescript-eslint'
  ],
  'rules': {
    '@typescript-eslint/no-empty-interface': 'warn',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'import/no-unresolved': 'off',
    'no-multiple-empty-lines': 1,
    'import/order': 'warn',
    'no-unused-vars': 'off',
    'max-lines-per-function': [
      'warn',
      {
        'max': 80,
        'skipComments': true,
        'skipBlankLines': true
      }
    ]
  },
  'env': {
    'node': true,
    'browser': false,
    'jest': true
  },
  'ignorePatterns': [
    'playground',
    'templates',
    'esm',
    'lib',
    'bin'
  ]
}
