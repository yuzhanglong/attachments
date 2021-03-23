module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: [
    'playground',
    'examples'
  ],
  coverageDirectory: './coverage/',
  collectCoverage: true
}

