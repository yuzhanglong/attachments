/*
 * File: CoreManager.ts
 * Description: 负责 cli 命令管理的模块
 * Created: 2021-1-28 20:45:40
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { BaseCommandValidateResult, CreateOptions } from './types/options'
import * as process from 'process'
import { chalk } from '@attachments/serendipity-public'
import { serendipityEnv } from '@attachments/serendipity-public'
import * as path from 'path'
import * as fs from 'fs'
import logger from '@attachments/serendipity-public/bin/utils/logger'
import ServiceManager from './serviceManager'
import { ServiceModule } from '@attachments/serendipity-public/bin/types/cliService'


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
        process.exit(0)
      }
    }
  }

  /**
   * 基本命令校验（不包括 service 层注入的命令）
   *
   * @author yuzhanglong
   * @date 2021-2-4 12:06:07
   */
  static validateBaseCommand(options: CreateOptions): BaseCommandValidateResult {
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

    // base path 初始化
    this.basePath = path.resolve(process.cwd(), name)

    logger.log(`在 ${chalk.yellow(this.basePath)} 创建项目中... `)

    const validateResult = CoreManager.validateBaseCommand(options)

    // 参数验证
    if (!validateResult.validated) {
      logger.error(`传入的选项有误：${validateResult.message}`)
    }

    // 获取对应 project 类型的 service 包
    let serviceModule: ServiceModule
    try {
      serviceModule = require(`@attachments/serendipity-service-${options.type}`)
    } catch (e) {
      logger.error('获取 service 包失败，请检查相应的 service 模块是否存在！')
      if (!serendipityEnv.isSerendipityDevelopment()) {
        process.exit(0)
      } else {
        return
      }
    }

    // 初始化项目目录
    this.initWorkDir()

    // 初始化脚手架 service
    const serviceManager = new ServiceManager(options.type, this.basePath, serviceModule)

    // 执行 service inquirer
    serviceManager.runServiceInquirer()

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
    await serviceManager.writeAppConfig()

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
}


export default CoreManager