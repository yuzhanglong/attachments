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


// 包管理工具类型
export type PackageManagerCli = 'yarn' | 'npm'