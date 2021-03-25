/*
 * File: common.ts
 * Description: 一般类型定义
 * Created: 2021-1-30 12:19:53
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


// 项目创建时配置

import { CommonObject } from '@attachments/serendipity-public'

export interface CreateOptions {
  // 是否初始化 git
  git?: boolean

  // 自定义初次 commit 的 message
  commit?: string

  // 项目预设
  preset?: string
}

export interface AddOption {
  version?: string
  localPath?: string
  delete?: boolean
}

// 质询问题结果
export type InquiryResult = CommonObject


// app 配置中 plugins

export interface AppConfigPlugin {
  name: string,
  options?: CommonObject
}

// app 配置，针对 service 的额外配置可以
export interface AppConfig {
  plugins?: AppConfigPlugin[]
}