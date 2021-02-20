/*
 * File: common.ts
 * Description: 类型集合
 * Created: 2021-2-19 23:19:59
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

export type ClassConstructor<T> = { new(...args: []): T }

export interface MetaItem {
  target: unknown
  propertyKey: string | symbol
}

export interface CommandMetaItem extends MetaItem {
  command: string
}

export interface PluginMetaData {
  command: CommandMetaItem[]
}