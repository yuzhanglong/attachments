/*
 * File: appConfig.ts
 * Description: app 配置声明
 * Created: 2021-2-1 22:31:45
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { CommonObject } from '@attachments/serendipity-public/bin/types/common'

export interface AppConfig {
  webpackConfig: CommonObject
  plugins: string[]
}