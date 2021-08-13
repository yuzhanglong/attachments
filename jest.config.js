module.exports = {
  preset: 'ts-jest',
  collectCoverage: false,
  testRegex: '(/__tests__/.*\\.(test|spec))\\.ts$',
  collectCoverageFrom: [
    'packages/**/*.ts',
  ],
  testEnvironment: 'node'
};
