/*
 * File: configurations.ts
 * Description: webpack 配置
 * Created: 2021-2-6 22:13:46
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

// 抽离部分 webpack 配置到这里来

import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import { serendipityEnv } from '@attachments/serendipity-public'
import { appHtml } from '@attachments/serendipity-public/lib/utils/paths'

// HtmlWebpackPlugin Config
export const getHtmlWebpackPluginOptions = (): HtmlWebpackPlugin.Options => {
  const base = {}
  return Object.assign(
    base,

    // 公共配置
    {
      inject: true,
      template: appHtml
    } as HtmlWebpackPlugin.Options,

    // 生产环境的额外配置
    serendipityEnv.isProjectProduction() ? {
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      } as HtmlWebpackPlugin.MinifyOptions
    } : undefined
  )
}