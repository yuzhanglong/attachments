/*
 * File: common.ts
 * Description: 一般类型定义
 * Created: 2021-1-30 12:19:53
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { Configuration } from 'webpack'
import { Configuration as DevServerConfiguration } from 'webpack-dev-server'

// object 类型，不要使用 any
export type CommonObject = Record<string, unknown>

// webpack 配置别名，由各个包共享而不额外安装
export type WebpackConfiguration = Configuration

// webpack-dev-server 配置别名，由各个包共享而不额外安装
export type WebpackDevServerConfiguration = DevServerConfiguration

// webpack 配置
export interface WebpackConfig {
  devServerConfig?: WebpackDevServerConfiguration
  webpackConfig?: WebpackConfiguration
}

// app 配置
export interface AppConfig {
  plugins?: string[]
  webpack?: WebpackConfig
  additional?: CommonObject
}