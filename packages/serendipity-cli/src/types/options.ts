/*
 * File: options.ts
 * Description: 选项相关类型定义
 * Created: 2021-1-28 20:57:25
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

export interface BaseCommandValidateResult {
  message: string
  validated: boolean
}

export interface AddOption {
  version?: string
  localPath?: string
  delete?: boolean
}