/*
 * File: common.ts
 * Description: 一般类型定义
 * Created: 2021-1-30 12:19:53
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { Configuration } from 'webpack'
import { Configuration as DevServerConfiguration } from 'webpack-dev-server'

// 项目创建时配置
export interface CreateOptions {
  // 是否初始化 git
  git?: boolean

  // 自定义初次 commit 的 message
  commit?: string

  // 项目预设
  preset?: string
}

// object 类型，不要使用 any
export type CommonObject = Record<string, unknown>

// webpack 配置别名，由各个包共享而不额外安装
export type WebpackConfiguration = Configuration

// webpack-dev-server 配置别名，由各个包共享而不额外安装
export type WebpackDevServerConfiguration = DevServerConfiguration

// 质询问题结果
export type InquiryResult = CommonObject


// app 配置中 plugins

export interface AppConfigPlugin {
  name: string,
  options: unknown
}

// app 配置，针对 service 的额外配置可以
export interface AppConfig {
  plugins?: AppConfigPlugin[]
}

// 包管理工具类型
export type PackageManagerCli = 'yarn' | 'npm'

// packageManager 模块安装选项
export interface ModuleInstallOptions {
  // 模块名称
  name: string

  // 模块版本
  version?: string

  // 模块本地路径
  localPath?: string,

  // 失败回调函数
  onError?: (e: Error) => void
}

export type Constructor = unknown;
