/*
 * File: runtime.ts
 * Description: eslint 配置 runtime plugin
 * Created: 2021-2-4 21:09:46
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { PluginRuntimeOptions } from '@attachments/serendipity-public/bin/types/plugin'
import { appRoot, appSource } from '@attachments/serendipity-service-react/bin/utils/paths'
import { serendipityEnv } from '@attachments/serendipity-public'

const ESLintWebpackPlugin = require('eslint-webpack-plugin')

module.exports = (options: PluginRuntimeOptions) => {
  // 合并 webpack 配置
  options.mergeWebpackConfig({
    plugins: [
      // 开发环境时注入 plugin
      serendipityEnv.isProjectDevelopment() && new ESLintWebpackPlugin({
        // lint 主目录
        context: appSource,

        // 欲 lint 的文件扩展名
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],

        // eslint 路径
        eslintPath: require.resolve('eslint'),

        // 主目录
        cwd: appRoot
      })
    ].filter(Boolean)
  })
}