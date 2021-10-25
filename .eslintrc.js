module.exports = {
  extends: ['plugin:@attachments/eslint-plugin/recommended'],
  plugins: ['@attachments/eslint-plugin'],
  ignorePatterns: ['lib', 'esm', 'cjs', 'packages/monitor/__tests__/e2e'],
  rules: {
    'jest/valid-expect': 'off',
  },
};
