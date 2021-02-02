/*
 * File: webpackBase.ts
 * Description: webpack 基础配置
 * Created: 2021-2-2 00:54:46
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { Configuration } from 'webpack'
import { appBuild, appEntry } from '../utils/paths'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'

const baseConfig: Configuration = {
  entry: {
    app: appEntry
  },
  mode: 'development',
  output: {
    filename: 'index.js',
    path: appBuild
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({})
  ]
}

export default baseConfig

