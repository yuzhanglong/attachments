/*
 * File: utils.ts
 * Description: 工具函数模块
 * Created: 2021-2-13 22:02:34
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as path from 'path'
import { BaseObject } from '@attachments/serendipity-public'
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
export const getAppConfigFromConfigFile = (basePath: string, onError?: ErrorFn): BaseObject => {
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

/**
 * 生成一个默认的 package.json 配置
 *
 * @author yuzhanglong
 * @param name 名称
 * @date 2021-2-21 19:20:14
 */
export const getBasePackageJsonContent = (name?: string) => {
  return {
    'name': name || 'serendipity-project',
    'version': '1.0.0',
    'main': 'index.js',
    'license': 'MIT'
  }
}


export function getPresetPathByName(name: string) {
  // 如果没有后缀名，我们需要加上
  if (!name.endsWith('.js')) {
    name = name + '.js'
  }
  return path.resolve(__dirname, '../presets', name)
}
