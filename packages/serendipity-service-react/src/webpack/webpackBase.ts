/*
 * File: webpackBase.ts
 * Description: webpack 基础配置
 * Created: 2021-2-2 00:54:46
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { Configuration } from 'webpack'
import { appBuild, appEntry, appHtml } from '../utils/paths'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'

const WebpackBar = require('webpackbar')

// TODO: 区分开发和生产环境

const baseConfig: Configuration = {
  entry: {
    app: appEntry
  },
  mode: 'development',
  output: {
    filename: 'index.js',
    path: appBuild
  },
  devtool: 'source-map',
  plugins: [
    // html 模板（基于 public 目录）
    new HtmlWebpackPlugin({
      template: appHtml
    }),

    // webpack 进度条
    new WebpackBar({
      basic: false
    })
  ]
}

export default baseConfig

