/*
 * File: cliService.ts
 * Description: service 层公共类型声明
 * Created: 2021-1-28 22:13:44
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { PluginModule } from './plugin'
import { CommonObject, CreateOptions, InquiryResult } from './common'


// service 模块
export interface ServiceModule {
  service?: (option: ServiceOption) => void
  inquiry?: (option: ServiceInquiryOption) => InquiryResult
}


// service 模块选项
export interface ServiceOption {
  // 配置 package.json
  setPackageConfig: (config: CommonObject) => void

  // 执行单个插件
  registerPlugin: (name: string, plugin: PluginModule) => void

  // 自定义的质询结果
  inquiryResult: InquiryResult
}

// 合并 package.json 配置选项
export interface MergePackageConfigOptions {
  merge?: boolean
  ignoreNullOrUndefined?: boolean
}

// service inquirer 配置选项
export interface ServiceInquiryOption {
  // 创建工程时相关参数
  createOptions: CreateOptions
}