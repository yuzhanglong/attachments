/*
 * File: common.ts
 * Description: 一般类型定义
 * Created: 2021-1-30 12:19:53
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


// 项目创建时配置

import { BaseObject } from '@attachments/serendipity-public'

// 创建时相关配置
export interface CreateOptions {
  // basic
  name: string
  presetPath: string

  // git
  initGit?: boolean
  gitMessage?: string

  // 基础路径
  workingDir?: string
}

export interface AddOption {
  version?: string
  localPath?: string
  delete?: boolean
}

// 质询问题结果
export type InquiryResult = BaseObject


// app 配置中 plugins

export interface AppConfigPlugin {
  name: string,
  options?: BaseObject
}

// app 配置，针对 service 的额外配置可以
export interface AppConfig {
  plugins?: AppConfigPlugin[]
}

export interface PluginModuleInfo {
  // require 的结果
  requireResult: any

  // 该插件的绝对路径
  absolutePath?: string

  // 额外的参数
  options?: BaseObject

  // 名称
  name?: string
}
