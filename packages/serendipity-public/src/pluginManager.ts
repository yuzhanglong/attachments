/*
 * File: pluginRunner.ts
 * Description: 插件执行器
 * Created: 2021-1-28 23:53:43
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { PluginModule, PluginRuntime } from './types/plugin'

class PluginManager {
  // 模块
  private pluginModules: PluginModule[]


  public getPluginModule(): PluginModule[] {
    return this.pluginModules
  }


  public runPlugin(pluginModule: PluginModule): void {
    this.pluginModules.push(pluginModule)
    this.attachPluginRuntime(pluginModule.runTime)
  }

  public runPlugins(pluginModules: PluginModule[]): void {
    for (const pluginModule of pluginModules) {
      this.runPlugin(pluginModule)
    }
  }

  public attachPluginRuntime(runtime: PluginRuntime): void {
    runtime()
  }
}

export default PluginManager