/*
 * File: pluginExecute.ts
 * Description: plugin 执行相关类型
 * Created: 2021-2-20 23:12:00
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { SyncHook } from 'tapable'
import { CommonObject } from '@attachments/serendipity-public'
import AppManager from '../appManager'
import PluginFactory from '../pluginFactory'

export interface ScriptOptions {
  appManager: AppManager
  scriptHooks: ScriptBaseHooks
  matchPlugin: (name: string) => PluginFactory
  inquiryResult?: CommonObject
}

export interface RuntimeOptions {
  appManager: AppManager
  scriptHooks: ScriptBaseHooks
  matchPlugin: (name: string) => PluginFactory
}

export interface ConstructionOptions {
  appManager: AppManager
  matchPlugin: (name: string) => PluginFactory
  inquiryResult: unknown
  renderTemplate: (base: string, options?: CommonObject, target?: string) => void
}

export interface ScriptBaseHooks {
  // 脚本执行前 hook
  beforeScriptExecute: SyncHook<void>

  // 脚本执行 hook
  scriptExecute: SyncHook<void>

  // 脚本执行后 hook
  afterExecute: SyncHook<void>
}