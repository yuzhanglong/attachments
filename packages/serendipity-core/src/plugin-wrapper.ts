/*
 * File: pluginFactory.ts
 * Description: 插件工厂模块
 * Created: 2021-2-20 12:26:11
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { BaseObject, Constructable, inquirer } from '@attachments/serendipity-public'
import {
  PLUGIN_CONSTRUCTION_META_KEY,
  PLUGIN_INQUIRY_META_KEY,
  PLUGIN_NAME_META_KEY, PLUGIN_RUNTIME_META_KEY, PLUGIN_SCRIPT_META_KEY
} from './common'
import { PluginModuleInfo } from './types/plugin'
import { PluginMethodMetaBase } from './types/pluginMeta'
import 'reflect-metadata'


export class PluginWrapper {
  // plugin require 得到的实例
  private pluginInstance: any

  // plugin 模块信息
  private readonly pluginModuleInfo: PluginModuleInfo

  constructor(pluginModuleInfo?: PluginModuleInfo) {
    this.pluginModuleInfo = pluginModuleInfo
    this.initPluginInstance()
  }

  /**
   * 初始化 plugin 实例
   *
   * @author yuzhanglong
   * @date 2021-5-29 15:58:54
   */
  private initPluginInstance() {
    const { requireResult, options } = this.pluginModuleInfo

    if (typeof requireResult === 'object') {
      // default export 的 require 结果，我们需要取到 default 属性
      this.pluginInstance = new (requireResult as { default: Constructable }).default(options)
    } else {
      // 一个 class (typeof class = 'object') 直接实例化即可
      this.pluginInstance = new (requireResult as Constructable)(options)
    }
  }

  /**
   * plugin 实例 getter
   *
   * @author yuzhanglong
   * @date 2021-5-29 15:59:12
   */
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
   * TIP: constructor 会被忽略
   *
   * @author yuzhanglong
   * @date 2021-2-20 17:21:40
   */
  public getPluginOwnPropertyNames() {
    const prototype = Object.getPrototypeOf(this.pluginInstance)

    // 获取所有 method names
    return Object.getOwnPropertyNames(prototype).filter(res => res !== 'constructor')
  }

  /**
   * 以 metaKey 为参数，获取 plugin 相应的方法数组
   *
   * @param metaKey metaKey 常量
   * @date 2021-5-29 19:30:03
   */
  public getPluginMethodsByMetaKey(metaKey: string) {
    const methods: PluginMethodMetaBase[] = []
    const methodNames = this.getPluginOwnPropertyNames()
    for (const methodName of methodNames) {
      const targetFn = this.pluginInstance[methodName]
      const metaResult = Reflect.getMetadata(metaKey, targetFn)
      if (metaResult) {
        methods.push({
          methodName: methodName,
          metaResult: metaResult
        })
      }
    }
    return methods
  }

  /**
   * 执行 plugin 的 meta 逻辑
   *
   * @author yuzhanglong
   * @date 2021-5-29 19:39:51
   */
  public async executeMetaMethods(metaKey: string, ...args: any[]) {
    const returnValues = []
    const runtimeMethods = this.getPluginMethodsByMetaKey(metaKey)
    for (const runtimeMethod of runtimeMethods) {
      const instance = this.getPluginInstance()
      const ret = await instance[runtimeMethod.methodName](...args)
      returnValues.push(ret)
    }
    return returnValues
  }

  /**
   * 执行 plugin 的 meta 逻辑 @Runtime
   *
   * @author yuzhanglong
   * @date 2021-5-29 20:04:51
   */
  public async executeRuntime(...args: any[]) {
    // runtime 逻辑不需要返回值，这里我们不返回
    await this.executeMetaMethods(PLUGIN_RUNTIME_META_KEY, ...args)
  }

  /**
   * 执行 plugin 的 meta 逻辑 @Script，注意，如果有重复的，我们只执行一个
   *
   * @author yuzhanglong
   * @param script 脚本字符串
   * @param args 其它参数
   * @date 2021-5-29 20:05:29
   */
  public async executeScript(script: string, ...args: any[]) {
    const runtimeMethods = this.getPluginMethodsByMetaKey(PLUGIN_SCRIPT_META_KEY)
    for (const runtimeMethod of runtimeMethods) {
      const instance = this.getPluginInstance()
      if (runtimeMethod.metaResult === script) {
        await instance[runtimeMethod.methodName](...args)
        // script 逻辑只执行第一个, 如果执行了就 break 掉
        break
      }
    }
  }

  /**
   * 执行 plugin 的 meta 逻辑 @Inquiry
   * example:
   * 如果我们传入下面的对象。那么所有 name 为 hello / world 的质询结果将被覆盖，不再向用户询问
   * {
   *   "hello":"1111",
   *   "world":"2222"
   * }
   * @author yuzhanglong
   * @param overrideInquiry 需要覆盖的质询内容(不在命令行层面上提出质询)
   * @date 2021-5-29 20:05:29
   */
  public async executeInquiry(overrideInquiry: BaseObject) {
    // 用户可以配置多个质询注解, 拿到当前插件的所有质询注解，然后拍平数组，调用 inquiry.js
    // 获取所有的质询方法
    const methodMeta = this.getPluginMethodsByMetaKey(PLUGIN_INQUIRY_META_KEY)
    const instance = this.getPluginInstance()

    const questions = []

    for (const pluginMethodMetaBase of methodMeta) {
      const { methodName } = pluginMethodMetaBase
      const q = instance[methodName]()
      questions.push(q)
    }
    const flattedQuestions = questions.flat()

    // 过滤掉要覆盖的质询内容
    const filterQuestions = flattedQuestions.filter(q => !(q.name in (overrideInquiry)))
    const inquiryResult = await inquirer.prompt(filterQuestions)

    // 覆盖结果
    const overrideInquiryEntries = Object.entries<any>(overrideInquiry)

    for (const [k, v] of overrideInquiryEntries) {
      inquiryResult[k] = v
    }
    return inquiryResult
  }

  /**
   * 执行 plugin 的 Construction 逻辑 @Inquiry
   *
   * @author yuzhanglong
   * @date 2021-5-29 21:07:43
   */
  public async executeConstruction(...args: any[]) {
    await this.executeMetaMethods(PLUGIN_CONSTRUCTION_META_KEY, ...args)
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

  /**
   * 获取 plugin 模块在 package.json 的名称
   *
   * @author yuzhanglong
   * @see PluginMetaData
   * @date 2021-5-29 16:14:54
   */
  public getPluginModuleName() {
    return this.pluginModuleInfo.name
  }
}
