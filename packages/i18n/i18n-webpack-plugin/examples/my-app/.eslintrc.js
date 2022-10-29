module.exports = {
  root: true,
  extends: ['plugin:@attachments/eslint-config/recommended'],
  plugins: ['@attachments/eslint-config'],
  ignorePatterns: ['lib', 'esm', 'cjs'],
  rules: {
    // if you use prettier, open it
    'prettier/prettier': 'off',
  },
};
