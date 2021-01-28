/*
 * File: serve.js
 * Description: 构建开发环境
 * Created: 2021-1-23 20:02:19
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require("../webpack/webpack.config");

const serve = () => {
  const DevServerConfig = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    },
    stats: {
      chunks: false,
      children: false,
      modules: false,
      chunkModules: false,
    },
  }
  const webpackConfig = webpackConfig();
  webpackConfig.entry = null;
}

module.exports = serve;