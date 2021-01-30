/*
 * File: CliManager.ts
 * Description: 负责 cli 命令管理的模块
 * Created: 2021-1-28 20:45:40
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { CreateOptions } from './types/options'
import * as process from 'process'
import { CliService } from '@attachments/serendipity-public/bin/types/cliService'
import PluginManager from '@attachments/serendipity-public/bin/core/pluginManager'
import { chalk, execa } from '@attachments/serendipity-public'
import * as path from 'path'
import * as fs from 'fs'
import logger from '@attachments/serendipity-public/bin/utils/logger'


class CliManager {
  private args
  private basePath

  constructor(args: string[]) {
    this.args = args
  }

  private initWorkDir(): void {
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath)
    }
  }

  private async runCommand(command: string, args: string[]): Promise<execa.ExecaChildProcess> {
    if (!args) {
      // \s 匹配任何空白字符，包括空格、制表符、换页符
      [command, ...args] = command.split(/\s+/)
    }

    return execa(
      command,
      args,
      {
        cwd: this.basePath
      }
    )
  }

  public async create(name: string, options: CreateOptions): Promise<void> {
    // base path 初始化
    this.basePath = path.resolve(process.cwd(), name)

    logger.log(`在 ${chalk.yellow(this.basePath)} 创建项目中... `)

    this.initWorkDir()

    // 获取对应 project 类型的 service 包
    let cliService: CliService
    try {
      cliService = require(`@attachments/serendipity-service-${options.type}`)
    } catch (e) {
      logger.log('获取 service 包失败，请检查相应的 service 模块是否存在！')
      process.exit(0)
    }



    // 处理插件
    const pluginManager = new PluginManager(this.basePath)

    // 初始化 git
    if (options.initGit) {
      logger.log('正在初始化 git 仓库...')
      await this.runCommand('git init', [])
    }

    // 执行 cli Service
    cliService({
      configurations: {},
      operations: {
        setPackageConfig: pluginManager.setPackageConfig.bind(pluginManager),
        runPluginTemplate: pluginManager.runPluginTemplate.bind(pluginManager),
        runPluginsTemplate: pluginManager.runPluginsTemplate.bind(pluginManager),
        mergePackageConfig: pluginManager.mergePackageConfig.bind(pluginManager)
      }
    })

    await pluginManager.writePackageConfig()

    // 初始化首次 commit
    if (options.initGit) {
      try {
        await this.runCommand('git add -A', [])
        await this.runCommand('git', ['commit', '-m', options.commit, '--no-verify'])
      } catch (e) {
        console.log(e)
      }
    }
    // 成功提示
    logger.log(`创建项目 ${name} 成功~`)
  }
}


export default CliManager