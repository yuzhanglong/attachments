/*
 * File: decorators.ts
 * Description: 装饰器模块
 * Created: 2021-2-19 20:55:04
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import 'reflect-metadata'
import {
  PLUGIN_CONSTRUCTION_META_KEY,
  PLUGIN_INQUIRY_META_KEY,
  PLUGIN_NAME_META_KEY,
  PLUGIN_RUNTIME_META_KEY,
  PLUGIN_SCRIPT_META_KEY
} from './common'

// 标记脚本
export const Script = (command: string) => {
  return (target: unknown, key: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(PLUGIN_SCRIPT_META_KEY, command, descriptor.value)
  }
}

// 标记插件类
export const SerendipityPlugin = (name: string) => {
  return (target) => {
    Reflect.defineMetadata(PLUGIN_NAME_META_KEY, name, target)
  }
}

// 标记质询
export const Inquiry = () => {
  return (target: unknown, key: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(PLUGIN_INQUIRY_META_KEY, true, descriptor.value)
  }
}

// 标记构建
export const Construction = () => {
  return (target: unknown, key: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(PLUGIN_CONSTRUCTION_META_KEY, true, descriptor.value)
  }
}

// 标记运行时
export const Runtime = () => {
  return (target: unknown, key: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(PLUGIN_RUNTIME_META_KEY, true, descriptor.value)
  }
}
