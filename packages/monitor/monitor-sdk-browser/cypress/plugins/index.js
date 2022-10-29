import webpackConfig from '../../webpack.config';
const { startDevServer } = require('@cypress/webpack-dev-server');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on('dev-server:start', options => startDevServer({ options, webpackConfig }));

  return config;
};
