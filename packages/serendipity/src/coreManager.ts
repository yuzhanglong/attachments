/*
 * File: CoreManager.ts
 * Description: 负责 cli 命令管理的模块
 * Created: 2021-1-28 20:45:40
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { BaseCommandValidateResult } from './types/options'
import { chalk, webpackMerge } from '@attachments/serendipity-public'
import { serendipityEnv } from '@attachments/serendipity-public'
import * as path from 'path'
import * as fs from 'fs'
import logger from '@attachments/serendipity-public/bin/utils/logger'
import ServiceManager from './serviceManager'
import { ServiceModule } from '@attachments/serendipity-public/bin/types/cliService'
import { AddOptions, AppConfig, CreateOptions } from '@attachments/serendipity-public/bin/types/common'
import PluginManager from './pluginManager'


class CoreManager {
  private args
  private basePath
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
  initWorkDir(): void {
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath)
    } else {
      logger.error('该目录已经存在，请删除旧目录或者在其他目录下执行创建命令！')
      if (!serendipityEnv.isSerendipityDevelopment()) {
        return
      }
    }
  }

  /**
   * 基本命令校验（不包括 service 层注入的命令）
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

    if (!options.type) {
      return getValidateErr('类型为空，请选择一个正确的项目类型，例如 \'react\'')
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
   * @date 2021-1-26
   */
  async create(name: string, options: CreateOptions): Promise<void> {
    this.options = options

    logger.info(`在 ${chalk.yellow(this.basePath)} 创建项目中...`)

    const validateResult = CoreManager.validateCreateCommand(options)

    // 参数验证
    if (!validateResult.validated) {
      logger.error(`传入的选项有误：${validateResult.message}`)
      return
    }

    // 获取对应 project 类型的 service 包
    let serviceModule: ServiceModule
    try {
      serviceModule = require(`@attachments/serendipity-service-${options.type}`)
    } catch (e) {
      logger.error('获取 service 包失败，请检查相应的 service 模块是否存在！')
      return
    }

    // 初始化项目目录
    this.initWorkDir()

    // 初始化脚手架 service
    const serviceManager = new ServiceManager(this.basePath, options, serviceModule)

    // 执行 service inquirer
    await serviceManager.runServiceInquirer()

    // 初始化 git
    if (options.initGit) {
      logger.info('正在初始化 git 仓库...')
      await serviceManager.initServiceGit()
      logger.done('git 初始化完成！')
    }

    // 执行 cli Service 构建时业务逻辑
    serviceManager.runCreateWorkTasks()

    // 执行 service 层注册的所有插件
    serviceManager.runPluginsTemplate()

    // 写入 package.json 文件
    await serviceManager.writePackageConfig()

    // 写入项目配置文件
    await serviceManager.setAppConfig()

    // 初始化首次 commit
    if (options.initGit) {
      try {
        await serviceManager.initFirstCommit(options.commit)
      } catch (e) {
        logger.error(e)
      }
    }

    // 安装所有依赖
    await serviceManager.install()

    // 成功提示
    logger.done(`创建项目 ${name} 成功~, happy coding!`)
  }

  /**
   * 添加一个插件
   *
   * @author yuzhanglong
   * @param name 插件名称（如果传入的话）
   * @param options 插件选项
   * @email yuzl1123@163.com
   * @date 2021-2-5 14:28:38
   */
  async add(name: string, options: AddOptions): Promise<void> {
    // 寻找配置文件
    const configFile = path.resolve(this.basePath, 'serendipity.js')

    // 配置文件不存在
    if (!fs.existsSync(configFile)) {
      logger.warn('配置文件 serendipity.js 不存在，请确认选择了正确的目录')
      return
    }

    const packageName = name ? `serendipity-plugin-${name}` : options.package

    // 初始化 pluginManager，此时 plugin 还没有安装
    const pluginManager = new PluginManager(
      this.basePath,
      packageName,
      null,
      null,
      null
    )

    // 安装 plugin
    await pluginManager.installPlugin()

    // 执行 template plugin
    pluginManager.runTemplate()

    // 更新配置文件，使 runtimePlugin 未来得以执行
    const currentAppConfig: AppConfig = require(configFile)

    if (currentAppConfig?.plugins.indexOf(packageName) < 0) {
      currentAppConfig?.plugins.push(packageName)
    }

    await ServiceManager.writeAppConfig(this.basePath, currentAppConfig)

    logger.done(`插件 ${packageName} 安装成功~`)
  }
}


export default CoreManager