/*
 * File: SerendipityBabelPlugin.ts
 * Description: SerendipityBabelPlugin
 * Created: 2021-2-23 23:17:01
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { Construction, Runtime } from '@attachments/serendipity-core'
import { appSource } from '@attachments/serendipity-public/lib/utils/paths'
import { ConstructionOptions, RuntimeOptions } from '@attachments/serendipity-core/lib/types/pluginExecute'
import { SerendipityReactPlugin } from '@attachments/serendipity-plugin-react'

class SerendipityBabelPlugin {
  static BASE_CONFIG = {
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
  }

  /**
   * React 项目初始化，合并 babel-loader 配置
   *
   * @author yuzhanglong
   * @date 2021-2-24 00:23:25
   */
  @Runtime()
  initBabelForReactProject(options: RuntimeOptions) {
    const plugin = options.matchPlugin('serendipity-react-plugin')
    const instance: SerendipityReactPlugin = plugin.getPluginInstance() as SerendipityReactPlugin
    if (plugin && instance) {
      instance.reactServiceHooks.beforeWebpackStart.tap('webpackMerge', (mergeFn) => {
        mergeFn(SerendipityBabelPlugin.BASE_CONFIG)
      })
    }
  }

  /**
   * 将 babel 配置写入 package.json
   *
   * @author yuzhanglong
   * @date 2021-2-24 00:24:10
   */
  @Construction()
  mergeBabelConfigInfoPackage(options: ConstructionOptions) {
    options.appManager.packageManager.mergeIntoCurrent({
      'babel': {
        'presets': [
          '@babel/preset-react',
          '@babel/preset-typescript'
        ]
      }
    })
  }
}

export default SerendipityBabelPlugin