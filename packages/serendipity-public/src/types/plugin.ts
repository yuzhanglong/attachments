/*
 * File: plugin.ts
 * Description: 插件声明
 * Created: 2021-1-28 23:56:16
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { AppConfig, CommonObject, CreateOptions, WebpackConfiguration } from './common'
import { MergePackageConfigOptions } from './cliService'


// plugin 模块
export interface PluginModule {
  // 运行时模块
  runtime?: PluginRuntime

  // 构建时模块
  template?: PluginTemplate
}

// 模板文件映射表
export type TemplateFilesMapper = Record<string, string>

export type PluginTemplateRender = (path: string, options?: CommonObject) => void

// template plugin 选项
export interface PluginTemplateOptions {
  // 模板渲染
  render: PluginTemplateRender

  // 合并 package.json 配置
  mergePackageConfig: (data: CommonObject, options?: MergePackageConfigOptions) => void

  // 合并 app 配置
  mergeAppConfig: (appConfig: AppConfig) => void

  // 项目创建时配置
  createOptions: CreateOptions
}

// runtime plugin 选项
export interface PluginRuntimeOptions {
  mergeWebpackConfig: (webpackConfig: WebpackConfiguration) => void
}

// 运行时 plugin 模块
export type PluginRuntime = (options: PluginRuntimeOptions) => void

// 模板 plugin 模块
export type PluginTemplate = (options: PluginTemplateOptions) => void