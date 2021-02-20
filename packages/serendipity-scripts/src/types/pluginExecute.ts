/*
 * File: pluginExecute.ts
 * Description: plugin 执行相关类型
 * Created: 2021-2-20 23:12:00
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { AppManager } from '@attachments/serendipity-public'
import { SyncHook } from 'tapable'
import PluginFactory from '../core/pluginFactory'

export interface ScriptOptions {
  appManager: AppManager
  hooks: ScriptHooks
  matchPlugin: (name: string) => PluginFactory
}

export interface ScriptHooks {
  // 脚本执行前 hook
  beforeScriptExecute: SyncHook<void>

  // 脚本执行 hook
  scriptExecute: SyncHook<void>

  // 脚本执行后 hook
  afterExecute: SyncHook<void>
}