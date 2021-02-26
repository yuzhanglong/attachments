/*
 * File: CoreManager.ts
 * Description: 负责 cli 命令管理的模块
 * Created: 2021-1-28 20:45:40
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as fs from 'fs'
import { chalk, isPlugin, logger, serendipityEnv } from '@attachments/serendipity-public'
import { CreateOptions } from '@attachments/serendipity-public/bin/types/common'
import ConstructionManager from './constructionManager'
import { AddOption, BaseCommandValidateResult } from './types/options'
import PresetManager from './presetManager'


class CoreManager {
  private readonly basePath

  private args
  private options: CreateOptions

  constructor(args: string[], basePath?: string) {
    this.args = args
    this.basePath = basePath
  }

  /**
   * 初始化工作目录，即 this.basePath
   * 如果目录已存在，我们不会创建项目
   *
   * @author yuzhanglong
   * @date 2021-1-26
   */
  public initWorkDir(): void {
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath)
    } else {
      logger.error('该目录已经存在，请删除旧目录或者在其他目录下执行创建命令！')
      if (!serendipityEnv.isSerendipityDevelopment()) {
        process.exit(0)
      } else {
        return
      }
    }
  }

  /**
   * 基本命令校验
   *
   * @author yuzhanglong
   * @param options 创建选项
   * @date 2021-2-4 12:06:07
   */
  static validateCreateCommand(options: CreateOptions): BaseCommandValidateResult {
    const getValidateErr = (message): BaseCommandValidateResult => {
      return {
        message: message,
        validated: false
      }
    }

    if (!options.preset) {
      return getValidateErr('preset 为空，请选择一个正确的 preset，可以是一个本地路径或者 http url')
    }

    return {
      message: null,
      validated: true
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
    this.options = options

    const pm = new PresetManager(this.basePath)
    await pm.initPresetByUrl(options.preset)

    logger.info(`在 ${chalk.yellow(this.basePath)} 创建项目中...`)

    // 参数验证
    const validateResult = CoreManager.validateCreateCommand(options)

    if (!validateResult.validated) {
      logger.error(`传入的选项有误：${validateResult.message}`)
      process.exit(0)
    }

    // 初始化项目目录
    this.initWorkDir()

    // 初始化 ConstructionManager（构建管理）
    const constructionManager = new ConstructionManager(this.basePath)


    // 安装 preset 列出的所有插件
    await constructionManager.installPluginsFromPresets(pm.getPreset())

    // 此时所有插件都已经安装完成
    // 接下来执行插件 @construction 下的逻辑, 合并 package.json
    await constructionManager.runPluginConstruction()

    // 安装合并进来的依赖
    await constructionManager.installDependencies()

    // 初始化 git(如果用户选择的话)
    if (options.git) {
      await constructionManager.initGit(options.commit)
    }

    // 成功提示
    logger.done(`创建项目 ${name} 成功~, happy coding!`)
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
    logger.info('添加插件成功~')
  }
}


export default CoreManager