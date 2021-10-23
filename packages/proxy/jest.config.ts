const base = require('../../jest.config');
// @ts-ignore
const { name } = require('./package.json');

module.exports = {
  ...base,
  name: name,
  displayName: name,
  collectCoverage: true,
};
