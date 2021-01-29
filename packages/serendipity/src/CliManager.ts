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
import * as path from 'path'
import * as fs from 'fs'


class CliManager {
  private args

  constructor(args: string[]) {
    this.args = args
  }

  async create(name: string, options: CreateOptions): Promise<void> {

    // base path 初始化
    const basePath = path.resolve(process.cwd(), name)
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath)
    }

    // 获取对应 project类型的 service 包
    let cliService: CliService
    try {
      cliService = require(`@attachments/serendipity-service-${options.type}`)
      // TODO: 提供自定义 service 接口，允许从其他地方导入包
    } catch (e) {
      console.log('获取 service 包失败，请检查类型是否支持！')
      process.exit(0)
    }

    // 处理插件
    const pluginManager = new PluginManager(basePath)

    cliService({
      configurations: {},
      operations: {
        setPackageConfig: pluginManager.setPackageConfig.bind(pluginManager),
        // 注意 this 指向
        runPluginTemplate: pluginManager.runPluginTemplate.bind(pluginManager),
        runPluginsTemplate: pluginManager.runPluginsTemplate.bind(pluginManager)
      }
    })
  }
}


export default CliManager