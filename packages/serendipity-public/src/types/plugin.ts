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

// 插件可以继承部分 service 能力
export interface PluginTemplateOptions {
  render: PluginTemplateRender
  mergePackageConfig: (data: CommonObject, options?: MergePackageConfigOptions) => void
}

// 运行时 plugin 模块
export type PluginRuntime = () => void

// 模板 plugin 模块
export type PluginTemplate = (options: PluginTemplateOptions) => void