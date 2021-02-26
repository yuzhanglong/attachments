/*
 * File: runtimeManager.ts
 * Description: 运行时 manager
 * Created: 2021-2-23 01:45:11
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { AppManager } from '@attachments/serendipity-public'
import { Constructor } from '@attachments/serendipity-public/bin/types/common'
import PluginExecutor from './pluginExecutor'

class RuntimeManager {
  public readonly appManager: AppManager
  public readonly pluginExecutor: PluginExecutor

  constructor(basePath: string) {
    this.appManager = new AppManager(basePath)
    this.pluginExecutor = new PluginExecutor(this.appManager)
  }


  registerPluginsFromPackage(appManager?: AppManager) {
    if (appManager) {
      this.pluginExecutor.registerPlugin(...appManager.getPluginModules())
    } else {
      this.pluginExecutor.registerPlugin(...this.appManager.getPluginModules())
    }
  }

  runCommand(command: string) {
    this.pluginExecutor.executeScript(command)
  }

  registerPlugin(plugin: Constructor) {
    this.pluginExecutor.registerPlugin({
      absolutePath: 'todo',
      requireResult: plugin
    })
  }
}

export default RuntimeManager