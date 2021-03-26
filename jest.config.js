module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: [
    'playground',
    'examples'
  ],
  collectCoverage: true
  // collectCoverageFrom: [
  //   'packages/**/*.ts',
  //   '!**/node_modules/**',
  //   '!**/templates/**',
  //   '!**/bin/**'
  // ]
}

