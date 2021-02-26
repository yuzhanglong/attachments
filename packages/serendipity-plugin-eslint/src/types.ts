/*
 * File: types.ts
 * Description: 类型定义
 * Created: 2021-2-26 15:46:38
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


export type ConfigOptions = 'Airbnb' | 'recommend'

export interface EslintInquiryOptions {
  environment: 'React' | '其他项目'
  useTypeScript: boolean
  extendConfig: ConfigOptions
}

export interface EslintCustomConfig {
  package: string
  extendName: string
  version: string
}

