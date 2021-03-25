/*
 * File: pluginFactory.ts
 * Description: 插件工厂模块
 * Created: 2021-2-20 12:26:11
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { Constructor } from '@attachments/serendipity-public'
import {
  PLUGIN_CONSTRUCTION_META_KEY,
  PLUGIN_INQUIRY_META_KEY,
  PLUGIN_NAME_META_KEY,
  PLUGIN_RUNTIME_META_KEY, PLUGIN_SCRIPT_META_KEY
} from './common/pluginMetaKeys'
import { PluginModuleInfo } from './types/plugin'
import { PluginMetaData } from './pluginMeta'
import 'reflect-metadata'


class PluginFactory {
  private readonly pluginInstance: unknown
  private readonly pluginModuleInfo: PluginModuleInfo


  constructor(pluginModuleInfo?: PluginModuleInfo) {
    const plugin = pluginModuleInfo.requireResult
    if (typeof plugin === 'object') {
      this.pluginInstance = new (plugin as { default: Constructor }).default(pluginModuleInfo.options)
    } else {
      this.pluginInstance = new (plugin as Constructor)(pluginModuleInfo.options)
    }
    this.pluginModuleInfo = pluginModuleInfo
  }

  public getPluginInstance() {
    return this.pluginInstance
  }

  /**
   * 获取 plugin name meta
   *
   * @author yuzhanglong
   * @date 2021-2-20 17:21:15
   */
  public getPluginMetaName() {
    const prototype = Object.getPrototypeOf(this.pluginInstance)
    const name = Reflect.getMetadata(PLUGIN_NAME_META_KEY, prototype.constructor)
    return name ? name : prototype.constructor.name
  }

  /**
   * 获取 plugin 所有的 methods name
   * constructor 会被忽略
   *
   * @author yuzhanglong
   * @date 2021-2-20 17:21:40
   */
  public getPluginMetaMethods() {
    const prototype = Object.getPrototypeOf(this.pluginInstance)

    // 获取所有 method names
    return Object.getOwnPropertyNames(prototype).filter(res => res !== 'constructor')
  }

  /**
   * 获取 plugin method metaData
   *
   * @author yuzhanglong
   * @date 2021-2-20 12:53:40
   */
  public getPluginMethodMetaData(): PluginMetaData {
    const result: PluginMetaData = {
      name: '',
      scripts: [],
      inquiries: [],
      constructions: [],
      runtime: []
    }
    const methodNames = this.getPluginMetaMethods()

    for (const methodName of methodNames) {
      const targetFn = this.pluginInstance[methodName]
      const command = Reflect.getMetadata(PLUGIN_SCRIPT_META_KEY, targetFn)
      const inquiry = Reflect.getMetadata(PLUGIN_INQUIRY_META_KEY, targetFn)
      const construction = Reflect.getMetadata(PLUGIN_CONSTRUCTION_META_KEY, targetFn)
      const runtime = Reflect.getMetadata(PLUGIN_RUNTIME_META_KEY, targetFn)
      // 脚本
      if (command) {
        result.scripts.push({
          methodName: methodName,
          command: command
        })
      }
      // 质询
      if (inquiry) {
        result.inquiries.push({
          methodName: methodName
        })
      }
      // 构建
      if (construction) {
        result.constructions.push({
          methodName: methodName
        })
      }
      // 运行时
      if (runtime) {
        result.runtime.push({
          methodName: methodName
        })
      }
    }
    return result
  }

  /**
   * 获取 plugin metaData
   *
   * @author yuzhanglong
   * @see PluginMetaData
   * @date 2021-2-20 12:53:11
   */
  public getPluginMetaData(): PluginMetaData {
    const methodMetas = this.getPluginMethodMetaData()
    return {
      name: this.getPluginMetaName(),
      scripts: methodMetas.scripts,
      inquiries: methodMetas.inquiries,
      constructions: methodMetas.constructions,
      runtime: methodMetas.runtime
    }
  }

  /**
   * 获取 plugin 绝对路径
   *
   * @author yuzhanglong
   * @see PluginMetaData
   * @date 2021-3-3 10:51:43
   */
  public getAbsolutePath() {
    return this.pluginModuleInfo.absolutePath
  }

  public getPluginModuleName() {
    return this.pluginModuleInfo.name
  }
}

export default PluginFactory
