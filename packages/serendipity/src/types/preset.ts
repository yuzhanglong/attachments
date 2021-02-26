/*
 * File: preset.ts
 * Description: 预设相关类型声明
 * Created: 2021-2-22 00:46:41
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


// 预设 plugin 字段
export interface PresetPlugin {
  name: string
  path?: string
  version?: string
  removeAfterConstruction?: boolean
}

// 预设
export interface SerendipityPreset {
  plugins?: PresetPlugin[]
}