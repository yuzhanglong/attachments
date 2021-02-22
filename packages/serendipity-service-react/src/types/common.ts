/*
 * File: common.ts
 * Description: react-service 公共配置
 * Created: 2021-2-4 15:42:04
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { AppConfig } from '@attachments/serendipity-public/bin/types/common'

export interface ReactServiceInquire {
  eslintSupport: boolean
}

export interface ReactServiceAppConfigOptions {
  webpackDevServerPort?: number
  webpackDevServerHost?: string
  webpackAnalysisPort?: number
}

export type ReactServiceAppConfig = AppConfig
