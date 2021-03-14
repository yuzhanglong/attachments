/*
 * File: ServiceManager.ts
 * Description: Service 层管理
 * Created: 2021-1-30 17:58:46
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as path from 'path'
import { AppConfig } from '@attachments/serendipity-public/bin/types/common'
import { logger, runCommand, writeFilePromise } from '@attachments/serendipity-public'
import { SerendipityPreset } from '@attachments/serendipity-public/bin/types/preset'
import { DEFAULT_COMMIT_MESSAGE } from './common'
import { getBasePackageJsonContent } from './utils'
import PluginExecutor from './pluginExecutor'
import AppManager from './appManager'


class ConstructionManager {
  private readonly basePath: string
  private readonly pluginExecutor: PluginExecutor
  private readonly appManager: AppManager

  constructor(basePath: string, resolvePackageConfig?: boolean) {
    this.basePath = basePath
    // 构建模式下并没有 App 配置文件， 我们使用默认的
    this.appManager = new AppManager(
      basePath,
      null,
      resolvePackageConfig ? null : getBasePackageJsonContent()
    )
    this.pluginExecutor = new PluginExecutor(this.appManager)
  }


  /**
   * 从 preset 安装 plugins
   *
   * @author yuzhanglong
   * @param preset preset 信息
   * @date 2021-2-22 01:28:12
   */
  public async installPluginsFromPresets(preset: SerendipityPreset) {
    const packageManager = this.appManager.packageManager

    if (Array.isArray(preset.plugins)) {
      const depMapper = {}
      preset.plugins.forEach(res => {
        // 路径优先，版本其次，否则使用最新版本 latest
        depMapper[res.name] = res.path || res.version || 'latest'
      })

      packageManager.mergeIntoCurrent({
        dependencies: depMapper
      })
    }
    await packageManager.writePackageConfig()
    await packageManager.installDependencies()
  }

  /**
   * 执行 plugin 构建流程
   *
   * @author yuzhanglong
   * @param names 需要执行的 plugins 名称，如果不传入此参数则执行所有的插件
   * @param preset 预设
   * @date 2021-2-21 11:05:50
   */
  public async runPluginConstruction(names?: string[], preset?: SerendipityPreset) {
    const pluginModules = this.appManager.getPluginModules()
    if (!Array.isArray(names) || names.length === 0) {
      this.pluginExecutor.registerPlugin(...pluginModules)
    } else {
      const newModules = pluginModules.filter(res => names.indexOf(res.name) >= 0)
      this.pluginExecutor.registerPlugin(...newModules)
    }
    await this.pluginExecutor.executeConstruction(preset)
  }

  /**
   * 写入 App 配置文件
   *
   * @param res 配置文件内容
   * @param target 目标目录
   * @author yuzhanglong
   * @date 2021-2-5 21:35:05
   */
  static async writeAppConfig(target: string, res?: AppConfig): Promise<void> {
    // stringify
    const jsonifyResult = JSON.stringify(res, null, 2)
    const result = `module.exports = ${jsonifyResult}`
    await writeFilePromise(
      path.resolve(target, 'serendipity.js'),
      result
    )
  }

  /**
   * 为 serviceModule 管理的目录 初始化 git
   *
   * @author yuzhanglong
   * @date 2021-1-30 19:27:18
   */
  async initGit(message?: string): Promise<void> {
    logger.info('正在初始化 git 仓库...')
    try {
      // init git
      await runCommand('git init', [], this.basePath)

      // init first commit
      await this.initFirstCommit(message || DEFAULT_COMMIT_MESSAGE)
    } catch (e) {
      logger.error('git 初始化失败！')
    }
    logger.done('git 初始化完成！')
  }

  /**
   * 初始化构建后提交
   *
   * @author yuzhanglong
   * @date 2021-1-30 19:37:54
   */
  async initFirstCommit(message: string): Promise<void> {
    await runCommand('git add -A', [], this.basePath)
    await runCommand('git', ['commit', '-m', message, '--no-verify'], this.basePath)
  }

  /**
   * 调用 packageManager 以安装依赖
   *
   * @author yuzhanglong
   * @date 2021-2-22 15:44:57
   */
  public async installDependencies() {
    // 不要忘记再写入一遍
    await this.appManager.packageManager.writePackageConfig()
    await this.appManager.packageManager.installDependencies()
  }

  /**
   * 安装插件
   *
   * @author yuzhanglong
   * @param name 插件的名称
   * @param version 插件的版本号，对应 dependence 的 value，所以也可以传入一个本地路径
   * @date 2021-2-25 11:32:01
   */
  public async installPlugin(name: string, version?: string): Promise<void> {
    const packageManager = this.appManager.packageManager
    packageManager.mergeIntoCurrent({
      dependencies: {
        [name]: version || 'latest'
      }
    })
    await packageManager.writePackageConfig()
    await packageManager.installDependencies()
  }

  /**
   * 移除 plugin
   *
   * @author yuzhanglong
   * @param names 插件的名称(可以传入多个)
   * @date 2021-2-26 21:59:35
   */
  public async removePlugin(...names: string[]) {
    for (const name of names) {
      await this.appManager.packageManager.removeDependency(name)
    }
  }
}

export default ConstructionManager
