/*
 * File: pluginExecutor.ts
 * Description: plugin 执行器
 * Created: 2021-2-20 18:28:30
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as path from 'path'
import { BaseObject, Constructable, renderTemplate } from '@attachments/serendipity-public'
import { AppManager } from './app-manager'
import { PluginWrapper } from './plugin-wrapper'
import { PLUGIN_SCRIPT_META_KEY, SERENDIPITY_SCRIPT_VERSION } from './common'
import { ConstructionOptions, PluginModuleInfo, ScriptOptions, SerendipityPreset } from './types'


export class PluginsExecutor {
  // plugin 列表
  private readonly plugins: PluginWrapper[] = []

  // AppManager
  private readonly appManager: AppManager

  constructor(appManager?: AppManager, basePath?: string) {
    this.plugins = []
    this.appManager = appManager || AppManager.createWithResolve(basePath)
  }

  /**
   * 注册 plugin(一个或者多个), 提供额外信息
   *
   * @author yuzhanglong
   * @date 2021-2-20 22:22:24
   */
  public registerPlugin(...pluginModule: PluginModuleInfo[]) {
    for (const pm of pluginModule) {
      this.plugins.push(new PluginWrapper(pm))
    }
  }

  /**
   * 注册 plugin(一个或者多个), 使用 plugin 构造函数
   *
   * @author yuzhanglong
   * @date 2021-2-20 22:22:24
   */
  public registerPluginByConstructor(...plugin: Constructable[]) {
    const result: PluginModuleInfo[] = plugin.map(p => {
      return {
        absolutePath: '',
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
  public async executeScript(command: string) {
    // 标记，确保只执行一次
    let executed = false
    // 首先初始化所有 plugin 的 runtime
    await this.executeRuntime()
    // TODO: 只保留一个 script 执行！
    for (const plugin of this.plugins) {
      if (executed) {
        return
      }

      await plugin.executeScript(command, {
        appManager: this.appManager,
        matchPlugin: this.matchPlugin.bind(this)
      } as ScriptOptions)

      executed = true
    }
  }

  /**
   * 初始化 runtime
   *
   * @author yuzhanglong
   * @date 2021-5-29 23:09:53
   */
  public async executeRuntime() {
    for (const plugin of this.plugins) {
      await plugin.executeRuntime({
        appManager: this.appManager,
        matchPlugin: this.matchPlugin.bind(this)
      })
    }
  }

  /**
   * 各插件构建方法执行
   *
   * @author yuzhanglong
   * @param preset 预设（可选）
   * @date 2021-2-20 22:55:38
   */
  public async executeConstruction(preset?: SerendipityPreset) {
    for (const plugin of this.plugins) {
      // 根据 plugin 名称获取需要 override 的选项
      const overridePlugin = preset?.plugins.filter(res => res.name === plugin.getPluginModuleName())

      const overrideInfo = overridePlugin?.length > 0 ? overridePlugin[0].overrideInquiries : {}

      const inquiryResult = await this.runPluginInquiry(overrideInfo || {})

      await plugin.executeConstruction({
        appManager: this.appManager,
        matchPlugin: this.matchPlugin.bind(this),
        inquiryResult: inquiryResult,
        renderTemplate: this.render.bind(this, plugin.getAbsolutePath())
      } as ConstructionOptions)
    }

    // 将执行脚本写入 package.json 以供用户调用
    this.mergeScriptsInfoPackageConfig()
  }

  /**
   * 各插件构建方法执行
   *
   * @author yuzhanglong
   * @param overrideInquiry 欲覆盖的质询
   * @date 2021-3-3 10:37:59
   */
  private async runPluginInquiry(overrideInquiry: BaseObject) {
    let res = {}
    for (const plugin of this.plugins) {
      const answers = await plugin.executeInquiry(overrideInquiry)
      res = { ...res, ...answers }
    }
    return res
  }

  /**
   * 根据 plugin 的名称来匹配一个 plugin
   *
   * @author yuzhanglong
   * @date 2021-2-20 23:34:13
   */
  private matchPlugin(pluginName: string): PluginWrapper {
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
   * @date 2021-6-6 12:52:48
   */
  private async render(basePath: string, dirName: string, options?: BaseObject, target?: string): Promise<void> {
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
      const methods = plugin.getPluginMethodsByMetaKey(PLUGIN_SCRIPT_META_KEY)
      for (const method of methods) {
        const command = method.metaResult
        this.appManager.packageManager.mergeIntoCurrent({
          scripts: {
            [command]: `serendipity-scripts run ${command}`
          }
        })
        isScriptAppear = true
      }
    }

    // 如果插件中带有脚本，我们就要 serendipity-scripts，它是用来执行脚本的
    if (isScriptAppear) {
      this.appManager.packageManager.mergeIntoCurrent({
        devDependencies: {
          ['@attachments/serendipity-scripts']: SERENDIPITY_SCRIPT_VERSION
        }
      })
    }
  }
}
