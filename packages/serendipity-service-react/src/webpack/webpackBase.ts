/*
 * File: webpackBase.ts
 * Description: webpack 基础配置
 * Created: 2021-2-2 00:54:46
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { appBuild, appEntry } from '../utils/paths'

const baseConfig = {
  entry: {
    app: appEntry
  },
  output: {
    path: appBuild,
    publicPath: 'build',
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
}

export default baseConfig

