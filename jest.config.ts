const config = {
  preset: 'ts-jest',
  collectCoverage: false,
  testRegex: '(/__tests__/.*\\.(test|spec))\\.ts$',
  collectCoverageFrom: [
    'packages/**/*.ts',
  ],
  coverageDirectory: '<rootDir>/coverage/',
  testEnvironment: 'node',
};

export default config;
