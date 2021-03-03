/*
 * File: CoreManager.ts
 * Description: 负责 cli 命令管理的模块
 * Created: 2021-1-28 20:45:40
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as fs from 'fs'
import * as path from 'path'
import { chalk, isPlugin, logger, PresetManager } from '@attachments/serendipity-public'
import { CreateOptions } from '@attachments/serendipity-public/bin/types/common'
import { SerendipityPreset } from '@attachments/serendipity-public/bin/types/preset'
import ConstructionManager from './constructionManager'
import { AddOption } from './types/options'


class CoreManager {
  private readonly executeDir: string
  private basePath: string

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
        logger.info(`preset 要求工作目录不得为空，你没有传入工作目录名称，将以默认值 ${preset.initialDirDefaultName} 替代`)
      }
      this.basePath = path.resolve(this.executeDir, name || preset.initialDirDefaultName)
    } else {
      this.basePath = path.resolve(this.executeDir, name ? name : '')
    }


    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath)
    } else {
      logger.error('该目录已经存在，请删除旧目录或者在其他目录下执行创建命令！')
      process.exit(0)
    }
  }

  /**
   * 基本命令校验
   *
   * @author yuzhanglong
   * @param options 创建选项
   * @date 2021-2-4 12:06:07
   */
  static validateCreateCommand(options: CreateOptions) {
    if (!options.preset) {
      logger.error('preset 为空，请选择一个正确的 preset，可以是一个本地路径或者 http url')
      process.exit(0)
    }
  }

  /**
   * 创建一个项目
   *
   * @author yuzhanglong
   * @param name 项目名称
   * @param options 项目选项
   * @see CreateOptions
   * @date 2021-2-21 10:43:58
   */
  async create(name: string, options: CreateOptions): Promise<void> {
    const pm = new PresetManager(this.executeDir)

    logger.info(`从 ${options.preset} 获取 preset 中...`)

    await pm.initPresetByUrl(options.preset)

    // 验证输入参数
    CoreManager.validateCreateCommand(options)

    // 如果用户传入了名称，那么新路径为 当前执行路径 + name
    this.initWorkDir(name, pm.getPreset())

    logger.info(`在 ${chalk.yellow(this.basePath)} 创建项目中...`)

    // 初始化 ConstructionManager（构建管理）
    const constructionManager = new ConstructionManager(this.basePath)


    // 安装 preset 列出的所有插件
    await constructionManager.installPluginsFromPresets(pm.getPreset())

    // 此时所有插件都已经安装完成
    // 接下来执行插件 @construction 下的逻辑, 合并 package.json
    await constructionManager.runPluginConstruction(null, pm.getPreset())

    // 安装合并进来的依赖
    await constructionManager.installDependencies()

    // 初始化 git(如果用户选择的话)
    if (options.git) {
      await constructionManager.initGit(options.commit)
    }

    await constructionManager.removePlugin(...pm.getPluginNamesShouldRemove())

    // 成功提示
    logger.done(`✨ 创建项目成功~, happy coding!`)
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

    logger.info(`添加插件 ${name} 中...`)

    if (!isPlugin(name)) {
      logger.error(`${name} 不是一个合法的插件名称，名称应该以 serendipity-plugin 或者 @attachments/serendipity-plugin 开头`)
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
    logger.info(`插件 ${name} 安装成功!`)

    // 移除无关的依赖，对于一些只有 construction 模式的插件，在构建完毕之后失去作用，我们直接移除它们
    if (options.delete) {
      logger.info('正在移除无关的依赖...')
      await constructionManager.removePlugin(name)
      logger.info('移除成功!')
    }
  }

  public getBasePath() {
    return this.basePath
  }
}


export default CoreManager
