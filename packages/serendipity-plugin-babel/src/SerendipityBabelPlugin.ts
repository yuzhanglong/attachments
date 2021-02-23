/*
 * File: SerendipityBabelPlugin.ts
 * Description: SerendipityBabelPlugin
 * Created: 2021-2-23 23:17:01
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { Construction, Runtime } from '@attachments/serendipity-scripts'
import { ConstructionOptions, RuntimeOptions } from '@attachments/serendipity-scripts/bin/types/pluginExecute'
import SerendipityReactPlugin from '@attachments/serendipity-plugin-react'
import { appSource } from '@attachments/serendipity-public/bin/utils/paths'

class SerendipityBabelPlugin {
  @Runtime()
  initBabelForReactProject(options: RuntimeOptions) {
    const plugin = options.matchPlugin('serendipity-react-plugin')
    const instance: SerendipityReactPlugin = plugin.getPluginInstance() as SerendipityReactPlugin
    if (plugin && instance) {
      instance.reactServiceHooks.beforeWebpackStart.tap('webpackMerge', (mergeFn) => {
        mergeFn({
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
      })
    }
  }

  @Construction()
  mergeBabelConfigInfoPackage(options: ConstructionOptions) {
    options.appManager.packageManager.mergeIntoCurrent({
      'babel': {
        'presets': [
          '@babel/preset-react'
        ]
      }
    })
  }
}

export default SerendipityBabelPlugin