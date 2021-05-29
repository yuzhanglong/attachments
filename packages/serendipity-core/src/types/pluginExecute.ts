/*
 * File: pluginExecute.ts
 * Description: plugin 执行相关类型
 * Created: 2021-2-20 23:12:00
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { BaseObject } from '@attachments/serendipity-public'
import { AppManager } from '../app-manager'
import { PluginWrapper } from '../plugin-wrapper'

export interface ScriptOptions {
  appManager: AppManager
  matchPlugin: (name: string) => PluginWrapper
  inquiryResult?: BaseObject
}

export interface RuntimeOptions {
  appManager: AppManager
  matchPlugin: (name: string) => PluginWrapper
}

export interface ConstructionOptions {
  appManager: AppManager
  matchPlugin: (name: string) => PluginWrapper
  inquiryResult: unknown
  renderTemplate: (base: string, options?: BaseObject, target?: string) => void
}
