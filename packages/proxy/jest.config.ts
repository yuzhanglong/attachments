const base = require('../../jest.config');
// @ts-expect-error
const { name } = require('./package.json');

module.exports = {
  ...base,
  name,
  displayName: name,
  collectCoverage: true,
};
