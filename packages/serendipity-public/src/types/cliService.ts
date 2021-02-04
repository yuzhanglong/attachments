/*
 * File: cliService.ts
 * Description: service 层公共类型声明
 * Created: 2021-1-28 22:13:44
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { PluginModule } from './plugin'
import { CommonObject, CreateOptions, InquireResult } from './common'


// service 模块
export interface ServiceModule {
  service: (option: ServiceOption) => void
  inquirer: (option: ServiceInquirerOption) => InquireResult
}


// service 模块选项
export interface ServiceOption {
  // package.json 配置
  operations: ServiceOperations

  configurations: CommonObject
}

// service 操作钩子
export interface ServiceOperations {
  // 配置 package.json
  setPackageConfig: (config: CommonObject) => void

  // 执行单个插件
  registerPlugin: (plugin: PluginModule) => void

  // 自定义的质询结果
  inquireResult: InquireResult
}

// 合并 package.json 配置选项
export interface MergePackageConfigOptions {
  merge?: boolean
  ignoreNullOrUndefined?: boolean
}

// service inquirer 配置选项
export interface ServiceInquirerOption {
  projectName: string
  basePath: string
  createOptions: CreateOptions
}