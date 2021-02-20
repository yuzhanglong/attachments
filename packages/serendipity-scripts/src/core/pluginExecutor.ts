/*
 * File: pluginExecutor.ts
 * Description: plugin 执行器
 * Created: 2021-2-20 18:28:30
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { AppManager } from '@attachments/serendipity-public'
import { SyncHook } from 'tapable'
import { Constructor } from '../types/pluginMeta'
import { ScriptHooks, ScriptOptions } from '../types/pluginExecute'
import PluginFactory from './pluginFactory'


class PluginExecutor {
  // plugin 列表
  private readonly plugins: PluginFactory[] = []

  // AppManager
  private readonly appManager: AppManager

  // plugin Hooks
  private readonly pluginExecutorHooks: ScriptHooks = {
    // 脚本执行前 hook
    beforeScriptExecute: new SyncHook(),

    // 脚本执行 hook
    scriptExecute: new SyncHook(),

    // 脚本执行后 hook
    afterExecute: new SyncHook()
  }


  constructor() {
    this.plugins = []
    this.appManager = new AppManager(process.cwd())
  }

  /**
   * 注册 plugin(一个或者多个)
   *
   * @author yuzhanglong
   * @date 2021-2-20 22:22:24
   */
  registerPlugin(...pluginFactory: Constructor[]) {
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
  runScript(command: string) {
    // 首先初始化所有的 runtime
    this.executeRuntime()
    for (const plugin of this.plugins) {
      const metaData = plugin.getPluginMetaData()
      for (const script of metaData.scripts) {
        plugin.getPluginInstance()[script.methodName]({
          hooks: this.pluginExecutorHooks,
          appManager: this.appManager
        } as ScriptOptions)

        // 匹配到正确的 command，执行相应的 tap
        if (script.command === command) {
          this.pluginExecutorHooks.beforeScriptExecute.call()
          this.pluginExecutorHooks.scriptExecute.call()
          this.pluginExecutorHooks.afterExecute.call()
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
  executeRuntime() {
    for (const plugin of this.plugins) {
      const metaData = plugin.getPluginMetaData()
      for (const pluginMethodMetaBase of metaData.runtime) {
        plugin.getPluginInstance()[pluginMethodMetaBase.methodName]({
          hooks: this.pluginExecutorHooks,
          plugins: this.plugins,
          appManager: this.appManager,
          matchPlugin: this.matchPlugin.bind(this)
        } as ScriptOptions)
      }
    }
  }

  matchPlugin(pluginName: string): PluginFactory {
    return this.plugins.find(res => res.getPluginMetaName() === pluginName)
  }

  getPlugins() {
    return this.plugins
  }
}

export default PluginExecutor