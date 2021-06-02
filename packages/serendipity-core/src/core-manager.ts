/*
 * File: CoreManager.ts
 * Description: 负责 cli 命令管理的模块
 * Created: 2021-1-28 20:45:40
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as fs from 'fs'
import * as path from 'path'
import { isPlugin, logger } from '@attachments/serendipity-public'
import { ConstructionManager } from './construction-manager'
import createCoreManagerHooks from './hooks/core-manager-hooks'
import { SerendipityPreset } from './types/preset'
import { AddOption } from './types/common'


export class CoreManager {
  private readonly executeDir: string
  private basePath: string
  private coreManagerHooks = createCoreManagerHooks()

  constructor(executeDir?: string) {
    this.executeDir = executeDir || process.cwd()
  }

  /**
   * 初始化工作目录，即 this.basePath
   * 如果目录已存在，我们不会创建项目
   *
   * @author yuzhanglong
   * @date 2021-1-26
   */
  public initWorkDir(name: string, preset: SerendipityPreset): void {
    // 如果 preset 要求创建目录，我们初始化它
    if (preset.initialDir) {
      if (!name || name === '') {
        logger.info(`preset 要求工作目录不得为空，你没有传入工作目录名称，将以默认值 ${preset.initialDirDefaultName} 替代\n`)
      }
      this.basePath = path.resolve(this.executeDir, name || preset.initialDirDefaultName)

      if (!fs.existsSync(this.basePath)) {
        fs.mkdirSync(this.basePath)
      } else {
        this.coreManagerHooks.onInitWorkDirFail.call([])
        process.exit(0)
      }

    } else {
      this.basePath = path.resolve(this.executeDir, name ? name : '')
    }
  }

  /**
   * 添加一个插件
   *
   * @author yuzhanglong
   * @param name 插件名称（如果传入的话）
   * @param options 插件选项
   * @date 2021-2-5 14:28:38
   */
  async add(name: string, options: AddOption): Promise<void> {
    // 在 add 模式下，basePath 就是当前路径
    this.basePath = this.executeDir

    // [hooks] -- onAddStart 在 add 执行开始时做些什么
    this.coreManagerHooks.onAddStart.call({
      name: name,
      option: options
    })

    if (!isPlugin(name)) {
      // [hooks] -- onAddValidateError 在 add 验证失败时做些什么
      this.coreManagerHooks.onAddValidateError.call({
        name: name,
        option: options
      })
      process.exit(0)
    }

    // 初始化 ConstructionManager（构建管理）
    const constructionManager = new ConstructionManager(this.basePath, true)
    await constructionManager.installPlugin(
      name, options.localPath || options.version
    )
    // 此时所有插件都已经安装完成
    // 接下来执行插件 @construction 下的逻辑, 合并 package.json
    await constructionManager.runPluginConstruction([name])

    // 安装合并进来的依赖
    await constructionManager.installDependencies()

    // [hooks] -- onPluginInstallSuccess 在 add 验证失败时做些什么
    this.coreManagerHooks.onPluginInstallSuccess.call({
      name: name,
      option: options
    })

    // 移除无关的依赖，对于一些只有 construction 模式的插件，在构建完毕之后失去作用，我们直接移除它们
    if (options.delete) {
      // [hooks] -- beforePluginDelete 在 plugin 即将被删除时做些什么
      this.coreManagerHooks.beforePluginDelete.call([])

      await constructionManager.removePlugin(name)

      // [hooks] -- beforePluginDelete 在 plugin 删除之后做些什么
      this.coreManagerHooks.afterPluginDelete.call([])
    }
  }

  public getBasePath() {
    return this.basePath
  }

  public getCoreManagerHooks() {
    return this.coreManagerHooks
  }
}
