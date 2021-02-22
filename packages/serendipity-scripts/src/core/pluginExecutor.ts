/*
 * File: pluginExecutor.ts
 * Description: plugin 执行器
 * Created: 2021-2-20 18:28:30
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import {
  AppManager,
  fileTreeWriting,
  getTemplatesData,
  inquirer,
  renderTemplateData
} from '@attachments/serendipity-public'
import { SyncHook } from 'tapable'
import { CommonObject, Constructor } from '@attachments/serendipity-public/bin/types/common'
import { ConstructionOptions, ScriptBaseHooks, ScriptOptions } from '../types/pluginExecute'
import PluginFactory from './pluginFactory'


class PluginExecutor {
  // plugin 列表
  private readonly plugins: PluginFactory[] = []

  // AppManager
  private readonly appManager: AppManager

  // plugin Hooks
  private readonly pluginScriptBaseHooks: ScriptBaseHooks = {
    // 脚本执行前 hook
    beforeScriptExecute: new SyncHook(),

    // 脚本执行 hook
    scriptExecute: new SyncHook(),

    // 脚本执行后 hook
    afterExecute: new SyncHook()
  }


  constructor(appManager?: AppManager) {
    this.plugins = []
    this.appManager = appManager
  }

  /**
   * 注册 plugin(一个或者多个)
   *
   * @author yuzhanglong
   * @date 2021-2-20 22:22:24
   */
  public registerPlugin(...pluginFactory: Constructor[]) {
    for (const plugin of pluginFactory) {
      this.plugins.push(new PluginFactory(plugin))
    }
  }


  /**
   * 执行某个脚本
   *
   * @author yuzhanglong
   * @date 2021-2-20 21:49:09
   */
  public executeScript(command: string) {
    // 首先初始化所有 plugin 的 runtime
    this.executeRuntime()

    // 遍历 plugin，查找含有 @script 的注解，执行之
    // 一旦有一个匹配，则不再处理其他的 plugin @script 注解
    for (const plugin of this.plugins) {
      const metaData = plugin.getPluginMetaData()
      for (const script of metaData.scripts) {
        plugin.getPluginInstance()[script.methodName]({
          scriptHooks: this.pluginScriptBaseHooks,
          appManager: this.appManager,
          matchPlugin: this.matchPlugin.bind(this)
        } as ScriptOptions)

        // 匹配到正确的 command，执行相应的 tap
        if (script.command === command) {
          this.pluginScriptBaseHooks.beforeScriptExecute.call()
          this.pluginScriptBaseHooks.scriptExecute.call()
          this.pluginScriptBaseHooks.afterExecute.call()
          return
        }
      }
    }

  }

  /**
   * 初始化 runtime
   *
   * @author yuzhanglong
   * @date 2021-2-20 22:55:38
   */
  private executeRuntime() {
    for (const plugin of this.plugins) {
      const metaData = plugin.getPluginMetaData()
      for (const pluginMethodMetaBase of metaData.runtime) {
        plugin.getPluginInstance()[pluginMethodMetaBase.methodName]({
          scriptHooks: this.pluginScriptBaseHooks,
          appManager: this.appManager,
          matchPlugin: this.matchPlugin.bind(this)
        } as ScriptOptions)
      }
    }
  }

  /**
   * 各插件构建方法执行
   *
   * @author yuzhanglong
   * @date 2021-2-20 22:55:38
   */
  public async executeConstruction() {
    for (const plugin of this.plugins) {
      const metaData = plugin.getPluginMetaData()
      // 在执行每个 plugin 之前，首先发起质询
      // 用户可以加了多个质询注解, 拿到当前插件的所有质询注解，然后拍平数组，调用 inquiry.js
      const inquiries = metaData.inquiries
        .map(res => plugin.getPluginInstance()[res.methodName]())
        .flat()

      const inquiryResult = await inquirer.prompt(inquiries)

      for (const construction of metaData.constructions) {
        await plugin.getPluginInstance()[construction.methodName]({
          appManager: this.appManager,
          matchPlugin: this.matchPlugin.bind(this),
          inquiryResult: inquiryResult,
          renderTemplate: this.renderTemplate.bind(this)
        } as ConstructionOptions)
      }
    }
  }

  /**
   * 根据 plugin 的名称来匹配一个 plugin
   *
   * @author yuzhanglong
   * @date 2021-2-20 23:34:13
   */
  private matchPlugin(pluginName: string): PluginFactory {
    return this.getPlugins().find(res => res.getPluginMetaName() === pluginName)
  }

  /**
   * plugin getter
   *
   * @author yuzhanglong
   * @date 2021-2-20 23:34:40
   */
  public getPlugins() {
    return this.plugins
  }

  /**
   * 渲染并写入模板
   *
   * @author yuzhanglong
   * @param base 要写入的绝对路径
   * @param options ejs 选项
   * @param target 目标路径
   * @date 2021-1-29 13:33:43
   */
  private async renderTemplate(base: string, options?: CommonObject, target?: string): Promise<void> {
    // 获取映射表
    const filesMapper = await getTemplatesData(
      base,
      target || this.appManager.getBasePath()
    )

    // 渲染模板数据
    renderTemplateData(filesMapper, options || {})

    // 模板拷贝
    await fileTreeWriting(filesMapper)
  }
}

export default PluginExecutor