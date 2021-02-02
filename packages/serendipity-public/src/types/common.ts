/*
 * File: common.ts
 * Description: 一般类型定义
 * Created: 2021-1-30 12:19:53
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { Configuration } from 'webpack'
import { Configuration as DevServerConfiguration } from 'webpack-dev-server'

export type CommonObject = Record<string, unknown>

export type WebpackConfiguration = Configuration
export type WebpackDevServerConfiguration = DevServerConfiguration

export interface WebpackConfig {
  devServerConfig?: WebpackDevServerConfiguration
  webpackConfig?: WebpackConfiguration
}

export interface AppConfig {
  plugins?: string[]
  webpack?: WebpackConfig
  additional?: CommonObject
}