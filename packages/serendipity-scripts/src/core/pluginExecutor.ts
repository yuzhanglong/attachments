/*
 * File: pluginExecutor.ts
 * Description: plugin 执行器
 * Created: 2021-2-20 18:28:30
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as path from 'path'
import {
  AppManager,
  inquirer, renderTemplate
} from '@attachments/serendipity-public'
import { SyncHook } from 'tapable'
import { CommonObject, Constructor } from '@attachments/serendipity-public/bin/types/common'
import { PluginModuleInfo } from '@attachments/serendipity-public/bin/types/plugin'
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
   * 注册 plugin(一个或者多个), 提供额外信息
   *
   * @author yuzhanglong
   * @date 2021-2-20 22:22:24
   */
  public registerPlugin(...pluginModule: PluginModuleInfo[]) {
    for (const pm of pluginModule) {
      const plugin = pm.requireResult
      if (typeof plugin === 'object') {
        this.plugins.push(
          new PluginFactory(
            (plugin as { default: Constructor }).default,
            pm.absolutePath
          )
        )
      } else {
        this.plugins.push(
          new PluginFactory(
            plugin as unknown as Constructor,
            pm.absolutePath
          )
        )
      }
    }
  }

  /**
   * 注册 plugin(一个或者多个), 使用 plugin 构造函数
   *
   * @author yuzhanglong
   * @date 2021-2-20 22:22:24
   */
  public registerPluginByConstructor(...plugin: Constructor[]) {
    const result: PluginModuleInfo[] = plugin.map(p => {
      return {
        absolutePath: '/',
        requireResult: p
      }
    })
    this.registerPlugin(...result)
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
          renderTemplate: this.render.bind(this, plugin.getAbsolutePath())
        } as ConstructionOptions)
      }
    }
    // 将执行脚本写入 package.json 以方便用户调用
    this.mergeScriptsInfoPackageConfig()
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
   * @param basePath plugin 所在模块路径
   * @param options 选项
   * @param dirName 模板文件名
   * @param target 目标目录
   * @date 2021-2-23 19:03:24
   */
  private async render(basePath: string, dirName: string, options?: CommonObject, target?: string): Promise<void> {
    // 最终的路径，对于用户只需要传入一个文件名就可以了
    const finalPath = path.resolve(basePath, 'templates', dirName)

    await renderTemplate(finalPath, options, target || this.appManager.getBasePath())
  }

  /**
   * 将 script 脚本执行命令写入 package.json
   *
   * @author yuzhanglong
   * @date 2021-2-23 14:44:04
   */
  private mergeScriptsInfoPackageConfig(): void {
    let isScriptAppear = false
    for (const plugin of this.plugins) {
      const metaData = plugin.getPluginMetaData()
      for (const script of metaData.scripts) {
        this.appManager.packageManager.mergeIntoCurrent({
          scripts: {
            [script.command]: `serendipity-scripts run ${script.command}`
          }
        })
        isScriptAppear = true
      }
    }

    // 如果插件中带有脚本，我们就要 serendipity-scripts，它是用来执行脚本的
    if (isScriptAppear) {
      this.appManager.packageManager.mergeIntoCurrent({
        dependencies: {
          ['@attachments/serendipity-scripts']: 'D:\\projects\\serendipity\\packages\\serendipity-scripts'
        }
      })
    }
  }
}

export default PluginExecutor