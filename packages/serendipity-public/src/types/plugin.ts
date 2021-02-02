/*
 * File: plugin.ts
 * Description: 插件声明
 * Created: 2021-1-28 23:56:16
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { CommonObject } from './common'
import { MergePackageConfigOptions } from './cliService'
import * as webpack from 'webpack'


// plugin 模块
export interface PluginModule {
  runtime: PluginRuntime
  template: PluginTemplate
}

// 模板文件映射表
export type TemplateFilesMapper = Record<string, string>

export type PluginTemplateRender = (path: string, options: CommonObject) => void

// template plugin 选项
export interface PluginTemplateOptions {
  render: PluginTemplateRender
  mergePackageConfig: (data: CommonObject, options?: MergePackageConfigOptions) => void
}

// runtime plugin 选项
export interface PluginRuntimeOptions {
  mergeWebpackConfig: (webpackConfig: webpack.Configuration) => void
}

// 运行时 plugin 模块
export type PluginRuntime = (options: PluginRuntimeOptions) => void

// 模板 plugin 模块
export type PluginTemplate = (options: PluginTemplateOptions) => void