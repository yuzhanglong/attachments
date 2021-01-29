/*
 * File: pluginRunner.ts
 * Description: 插件执行器
 * Created: 2021-1-28 23:53:43
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { PluginModule } from './types/plugin'
import { ServiceOperations } from './types/cliService'

class PluginManager implements Partial<ServiceOperations> {

  // 模块
  pluginModules: PluginModule[] = []

  /**
   * 获得所有的 plugin 模块
   *
   * @author yuzhanglong
   * @date 2021-1-29 11:51:38
   */
  public getPluginModule(): PluginModule[] {
    return this.pluginModules
  }

  /**
   * 执行 plugin 模板钩子
   *
   * @author yuzhanglong
   * @date 2021-1-29 11:51:36
   */
  public runPluginTemplate(pluginModule: PluginModule): void {
    this.pluginModules.push(pluginModule)
    console.log(this.pluginModules)
    pluginModule.template()
  }

  /**
   * 执行 多个 plugin
   *
   * @author yuzhanglong
   * @date 2021-1-29 11:51:42
   */
  public runPluginsTemplate(pluginModules: PluginModule[]): void {
    for (const pluginModule of pluginModules) {
      this.runPluginTemplate(pluginModule)
    }
  }
}

export default PluginManager