import { PluginRuntimeOptions } from '@attachments/serendipity-public/bin/types/plugin'
import { appSource } from '@attachments/serendipity-service-react/bin/utils/paths'

module.exports = (runtimeOptions: PluginRuntimeOptions) => {
  runtimeOptions.mergeWebpackConfig({
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          exclude: /(node_modules)/,
          include: appSource,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    }
  })
}