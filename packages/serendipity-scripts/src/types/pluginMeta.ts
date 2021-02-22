/*
 * File: pluginMeta.ts
 * Description: 类型集合
 * Created: 2021-2-19 23:19:59
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

export interface PluginMethodMetaBase {
  methodName: string
}

export interface PluginMetaScript extends PluginMethodMetaBase {
  command: string
}

export type PluginMetaInquiry = PluginMethodMetaBase

export type PluginMetaConstruction = PluginMethodMetaBase

export type PluginMetaRuntime = PluginMethodMetaBase

export interface PluginMetaData {
  name: string
  scripts: PluginMetaScript[]
  inquiries: PluginMetaInquiry[]
  constructions: PluginMetaConstruction[]
  runtime: PluginMetaRuntime[]
}