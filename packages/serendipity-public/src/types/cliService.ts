/*
 * File: cliService.ts
 * Description: service 层公共类型声明
 * Created: 2021-1-28 22:13:44
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { PluginModule } from './plugin'
import { CommonObject } from './common'


// service 模块
export type CliService = (options: ServiceOption) => void


// service 模块选项
export interface ServiceOption {
  // package.json 配置
  operations: ServiceOperations

  configurations: CommonObject
}

// service 操作钩子
export interface ServiceOperations {
  // 配置 package.json
  setPackageConfig: (config: Record<string, unknown>) => void

  // 合并 package.json 配置
  mergePackageConfig: (data: CommonObject, options: MergePackageConfigOptions) => void

  // 执行单个插件
  runPluginTemplate: (plugin: PluginModule) => void

  // 执行多个插件
  runPluginsTemplate: (plugins: PluginModule[]) => void
}


export interface MergePackageConfigOptions {
  merge?: boolean
  ignoreNullOrUndefined?: boolean
}