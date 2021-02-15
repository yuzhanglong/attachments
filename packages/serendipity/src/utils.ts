/*
 * File: utils.ts
 * Description: 工具函数模块
 * Created: 2021-2-13 22:02:34
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as path from 'path'
import { CommonObject } from '@attachments/serendipity-public/bin/types/common'
import { APP_CONFIG_NAME } from './common'


type ErrorFn = (e: Error) => void

/**
 * 初始化 app 配置
 *
 * @author yuzhanglong
 * @param basePath 要获取 AppConfig 的路径
 * @param onError 当出现错误时的回调函数
 * @date 2021-2-13 22:07:47
 */
export const getAppConfigFromConfigFile = (basePath: string, onError?: ErrorFn): CommonObject => {
  const configPath = path.resolve(basePath, APP_CONFIG_NAME)
  // tip: 配置文件可能不存在
  try {
    return require(configPath)
  } catch (e) {
    if (typeof onError === 'function') {
      onError(e)
    }
    throw new Error(e)
  }
}