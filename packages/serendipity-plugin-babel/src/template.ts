import { PluginTemplateOptions } from '../../serendipity-public/bin/types/plugin'

module.exports = (options: PluginTemplateOptions) => {
  // TODO: 结合 React 来配置，可参考 create-react-app
  options.mergePackageConfig({
    babel: {
      presets: ['test']
    },
    dependencies: {
      'core-js': '^3.8.1'
    }
  }, {})
}