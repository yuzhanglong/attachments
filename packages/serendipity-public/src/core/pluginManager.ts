/*
 * File: pluginRunner.ts
 * Description: 插件执行器
 * Created: 2021-1-28 23:53:43
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { ServiceOperations } from '../types/cliService'
import { PluginModule } from '../types/plugin'
import { getTemplatesData, renderTemplateData } from '../utils/template'
import * as process from 'process'
import { fileTreeWriting } from '../utils/files'

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
    pluginModule.template({
      render: PluginManager.render
    })
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

  static async render(base: string, options: any): Promise<void> {
    // 获取映射表
    const filesMapper = await getTemplatesData(base, process.cwd())

    // 渲染模板数据
    renderTemplateData(filesMapper, options)

    // 模板拷贝
    await fileTreeWriting(filesMapper)
  }
}

export default PluginManager