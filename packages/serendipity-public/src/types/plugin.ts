/*
 * File: plugin.ts
 * Description: 插件声明
 * Created: 2021-1-28 23:56:16
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


// 模板文件映射表

export type TemplateFilesMapper = Record<string, string>

// plugin 基本信息
export interface PluginModuleInfo {
  // require 的结果
  requireResult: unknown

  // 该插件的绝对路径
  absolutePath?: string
}