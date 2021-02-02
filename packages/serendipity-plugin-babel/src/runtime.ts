import { PluginRuntimeOptions } from '@attachments/serendipity-public/bin/types/plugin'

module.exports = (runtimeOptions: PluginRuntimeOptions) => {
  runtimeOptions.mergeWebpackConfig({
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    }
  })
}