const { startDevServer } = require('@cypress/webpack-dev-server');
import webpackConfig from '../../webpack.config';

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on('dev-server:start', (options) => startDevServer({ options, webpackConfig }));

  return config;
};
