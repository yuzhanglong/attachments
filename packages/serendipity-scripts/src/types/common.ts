/*
 * File: common.ts
 * Description: 类型集合
 * Created: 2021-2-19 23:19:59
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

export type Constructor<T = unknown> = new (...args: unknown[]) => T;

export interface PluginMetaScript {
  command: string
  methodName: string
}

export interface PluginMetaInquiry {
  methodName: string | undefined
}

export interface PluginMethodMetaData {
  script: PluginMetaScript
  inquiry: PluginMetaInquiry
}

export interface PluginMetaData {
  name: string
  scripts: PluginMetaScript[]
  inquiryMethodNames: string[]
}