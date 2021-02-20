/*
 * File: pluginFactory.ts
 * Description: 插件工厂模块
 * Created: 2021-2-20 12:26:11
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { Constructor, PluginMetaData, PluginMethodMetaData } from '../types/common'
import { PLUGIN_INQUIRY_META_KEY, PLUGIN_NAME_META_KEY, PLUGIN_SCRIPT_META_KEY } from '../common/pluginMetaKeys'

class PluginFactory {
  private readonly pluginInstance

  constructor(pluginConstructor: Constructor) {
    this.pluginInstance = new pluginConstructor()
  }

  public getPluginInstance() {
    return this.pluginInstance
  }

  /**
   * 获取 plugin name meta
   *
   * @author yuzhanglong
   * @date 2021-2-20 12:54:16
   */
  public getPluginMetaName() {
    const prototype = Object.getPrototypeOf(this.pluginInstance)
    return Reflect.getMetadata(PLUGIN_NAME_META_KEY, prototype.constructor)
  }

  /**
   * 获取 plugin 所有的 methods
   *
   * @author yuzhanglong
   * @date 2021-2-20 12:54:02
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
  public getPluginMethodMetaData(): PluginMethodMetaData[] {
    const methodNames = this.getPluginMetaMethods()
    return methodNames.map((name) => {
      const targetFn = this.pluginInstance[name]
      return {
        script: {
          command: Reflect.getMetadata(PLUGIN_SCRIPT_META_KEY, targetFn),
          methodName: name
        },
        inquiry: {
          methodName: Reflect.getMetadata(PLUGIN_INQUIRY_META_KEY, targetFn) ? name : undefined
        }
      }
    })
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
      scripts: methodMetas.map(res => res.script).filter(res => res.command !== undefined),
      inquiryMethodNames: methodMetas.map(res => res.inquiry.methodName).filter(res => res !== undefined)
    }
  }
}

export default PluginFactory