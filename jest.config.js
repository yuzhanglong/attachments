module.exports = {
  preset: 'ts-jest',
  collectCoverage: false,
  testRegex: '(/__tests__/.*\\.(test|spec))\\.ts$',
  collectCoverageFrom: [
    'packages/**/*.ts',
  ],
  coverageDirectory: '<rootDir>/coverage/',  projects: [
    '<rootDir>/packages/i18n',
    '<rootDir>/packages/i18n-babel-plugin',
    '<rootDir>/packages/proxy',
    '<rootDir>/packages/monitor'
  ],
  testEnvironment: 'node',
};
