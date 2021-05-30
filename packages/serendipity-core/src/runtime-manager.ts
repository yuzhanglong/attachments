/*
 * File: runtimeManager.ts
 * Description: 运行时(Runtime) manager
 * Created: 2021-2-23 01:45:11
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { Constructable } from '@attachments/serendipity-public'
import { PluginsExecutor } from './plugins-executor'
import { AppManager } from './app-manager'

export class RuntimeManager {
  public readonly appManager: AppManager
  public readonly pluginExecutor: PluginsExecutor

  constructor(basePath: string) {
    this.appManager = AppManager.createWithResolve(basePath)
    this.pluginExecutor = new PluginsExecutor(this.appManager)
  }

  public registerPluginsFromPackage() {
    const pluginModules = this.appManager.getPluginModules()
    this.pluginExecutor.registerPlugin(...pluginModules)
  }

  public async runCommand(command: string) {
    await this.pluginExecutor.executeScript(command)
  }

  registerPlugin(plugin: Constructable) {
    this.pluginExecutor.registerPlugin({
      absolutePath: '',
      requireResult: plugin
    })
  }

  public getPluginExecutor(){
    return this.pluginExecutor
  }
}
