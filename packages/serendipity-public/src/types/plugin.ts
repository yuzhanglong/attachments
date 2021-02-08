/*
 * File: plugin.ts
 * Description: 插件声明
 * Created: 2021-1-28 23:56:16
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { AppConfig, CommonObject, InquiryResult, WebpackConfiguration } from './common'
import { MergePackageConfigOptions } from './cliService'


// plugin 模块
export interface PluginModule {
  // 运行时模块
  runtime?: PluginRuntime

  // 构建时模块
  construction?: PluginConstruction

  // 质询模块
  inquiry?: (option: PluginInquiryOption) => InquiryResult
}

// 模板文件映射表
export type TemplateFilesMapper = Record<string, string>

export type PluginTemplateRender = (path: string, options?: CommonObject) => void

// template plugin 选项
export interface PluginConstructionOptions {
  // 模板渲染
  render: PluginTemplateRender

  // 合并 package.json 配置
  mergePackageConfig: (data: CommonObject, options?: MergePackageConfigOptions) => void

  // 合并 app 配置
  mergeAppConfig: (appConfig: AppConfig) => void

  // 质询结果
  inquiryResult: InquiryResult
}

// runtime plugin 选项
export interface PluginRuntimeOptions {
  mergeWebpackConfig: (webpackConfig: WebpackConfiguration) => void
}

// 运行时 plugin 模块
export type PluginRuntime = (options: PluginRuntimeOptions) => void

// 模板 plugin 模块
export type PluginConstruction = (options: PluginConstructionOptions) => void

// plugin inquirer 配置选项
export interface PluginInquiryOption {
  // app 配置（非修改后）
  appConfig?: AppConfig
}