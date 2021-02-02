/*
 * File: devServer.ts
 * Description: 本地开发服务器配置
 * Created: 2021-2-2 11:44:00
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { Configuration } from 'webpack-dev-server'

const devServerConfig: Configuration = {
  // 采用自定义输出而不是 webpack-dev-server 的默认输出
  // quiet: true,
  // clientLogLevel: 'none',
  compress: true,
  port: 9000,
  hot: true
}

export default devServerConfig