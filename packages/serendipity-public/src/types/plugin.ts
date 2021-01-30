/*
 * File: plugin.ts
 * Description: 插件声明
 * Created: 2021-1-28 23:56:16
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { ServiceOperations } from './cliService'

export interface PluginModule {
  runtime: PluginRuntime
  template: PluginTemplate
}

export type TemplateFilesMapper = Record<string, string>

export type PluginTemplateRender = (path: string, options: Record<string, unknown>) => void

// 插件可以继承部分 service 能力
export interface PluginTemplateOptions extends Omit<ServiceOperations, 'runPluginTemplate' | 'runPluginsTemplate' | 'setPackageConfig'> {
  render: PluginTemplateRender
}

// 运行时 plugin 模块
export type PluginRuntime = () => void

// 模板 plugin 模块
export type PluginTemplate = (options: PluginTemplateOptions) => void