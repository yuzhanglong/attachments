import webpackPreprocessor from '@cypress/webpack-preprocessor';
import webpackConfig from '../../webpack.config';
import task from '@cypress/code-coverage/task';

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  task(on, config);

  on(
    'file:preprocessor',
    webpackPreprocessor({
      webpackOptions: webpackConfig,
      watchOptions: {},
    })
  );

  return config;
};
