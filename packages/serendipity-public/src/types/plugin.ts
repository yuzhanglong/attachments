/*
 * File: plugin.ts
 * Description: 插件声明
 * Created: 2021-1-28 23:56:16
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { CommonObject } from './common'
import { MergePackageConfigOptions } from './cliService'


export interface PluginModule {
  runtime: PluginRuntime
  template: PluginTemplate
}

export type TemplateFilesMapper = Record<string, string>

export type PluginTemplateRender = (path: string, options: CommonObject) => void

export interface PluginTemplateOptions {
  render: PluginTemplateRender
  mergePackageConfig: (data: CommonObject, options?: MergePackageConfigOptions) => void
}

export interface PluginRuntimeOptions {
  mergeWebpackConfig: (webpackConfig: CommonObject) => void
}

// 运行时 plugin 模块
export type PluginRuntime = () => void

// 模板 plugin 模块
export type PluginTemplate = (options: PluginTemplateOptions) => void