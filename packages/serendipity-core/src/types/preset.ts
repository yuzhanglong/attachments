/*
 * File: preset.ts
 * Description: 预设相关类型声明
 * Created: 2021-2-22 00:46:41
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { CommonObject } from './common'

// 预设 plugin 字段
export interface PresetPlugin {
  // plugin 名称
  name: string

  // plugin 所在的本地路径
  path?: string

  // 要安装的 plugin 版本，默认为 latest
  version?: string

  // 是否在构建阶段之后移除之
  removeAfterConstruction?: boolean

  // 质询覆盖
  overrideInquiries?: CommonObject
}

// 预设
export interface SerendipityPreset {
  initialDir?: boolean
  initialDirDefaultName?: string
  plugins: PresetPlugin[]
}
