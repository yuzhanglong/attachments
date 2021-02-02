/*
 * File: CoreManager.ts
 * Description: 负责 cli 命令管理的模块
 * Created: 2021-1-28 20:45:40
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { CreateOptions } from './types/options'
import * as process from 'process'
import { CliService } from '@attachments/serendipity-public/bin/types/cliService'
import { chalk } from '@attachments/serendipity-public'
import * as path from 'path'
import * as fs from 'fs'
import logger from '@attachments/serendipity-public/bin/utils/logger'
import ServiceManager from './serviceManager'


class CoreManager {
  private args
  private basePath

  constructor(args: string[]) {
    this.args = args
  }

  private initWorkDir(): void {
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath)
    } else {
      logger.error('该目录已经存在，请删除旧目录或者在其他目录下执行创建命令！')
      process.exit(0)
    }
  }

  public async create(name: string, options: CreateOptions): Promise<void> {
    // base path 初始化
    this.basePath = path.resolve(process.cwd(), name)

    logger.log(`在 ${chalk.yellow(this.basePath)} 创建项目中... `)

    // 执行目录创建
    this.initWorkDir()

    // 获取对应 project 类型的 service 包
    let cliService: CliService
    try {
      cliService = require(`@attachments/serendipity-service-${options.type}`)
    } catch (e) {
      logger.log('获取 service 包失败，请检查相应的 service 模块是否存在！')
      process.exit(0)
    }

    // 初始化脚手架 service
    const serviceManager = new ServiceManager(options.type, this.basePath, cliService)

    // 初始化 git
    if (options.initGit) {
      logger.log('正在初始化 git 仓库...')
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

    console.log('install success!')

    // 成功提示
    logger.done(`创建项目 ${name} 成功~, happy coding!`)
  }
}


export default CoreManager