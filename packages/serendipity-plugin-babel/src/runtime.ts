/*
 * File: runtime.ts
 * Description: babel plugin runtime
 * Created: 2021-2-7 12:24:13
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

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
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/env',
                '@babel/preset-react'
              ]
            }
          }
        }
      ]
    }
  })
}