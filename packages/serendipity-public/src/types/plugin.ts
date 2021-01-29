/*
 * File: plugin.ts
 * Description: 插件声明
 * Created: 2021-1-28 23:56:16
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


export interface PluginModule {
  runtime: PluginRuntime
  template: PluginTemplate
}

export type TemplateFilesMapper = { [key: string]: string }

export type PluginTemplateRender = (path: string, options: any) => void

export interface PluginTemplateOptions {
  // TODO: 细化 options 类型
  render: PluginTemplateRender
}

// 运行时 plugin 模块
export type PluginRuntime = () => void

// 模板 plugin 模块
export type PluginTemplate = (options: PluginTemplateOptions) => void