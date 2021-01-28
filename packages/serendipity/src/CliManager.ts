/*
 * File: CliManager.ts
 * Description: 负责 cli 命令管理的模块
 * Created: 2021-1-28 20:45:40
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as fs from 'fs'
import { promisify } from 'util'
import * as path from 'path'
import { CreateOptions } from './types/options'
import { CliService } from '@attachments/serendipity-public/bin/types/cliService'
import PluginManager from '@attachments/serendipity-public/bin/pluginManager'

const writeFilePromise = promisify(fs.writeFile)

class CliManager {
  private args

  constructor(args: string[]) {
    this.args = args
  }

  async create(name: string, options: CreateOptions): Promise<boolean> {

    // 获取对应 project类型的 service 包
    const cliService: CliService = require(`@attachment/serendipity-service-${options.type}`)

    // 获取包配置，并写文件
    const packageConfig = cliService
    const targetPath = path.resolve(process.execPath, 'package.json')
    await writeFilePromise(targetPath, JSON.stringify(packageConfig))


    // 处理插件
    // 插件有多种交互方式 -- 如 template plugin / runtime plugin
    // core 包只负责项目的创建，
    // service 负责项目的开发 -- 部署环节
    const pluginManager = new PluginManager()

    cliService({
      configurations: {},
      operations: {
        setPackageConfig: () => {
          // TODO: package.json 配置
          console.log('package.json!')
        },
        runPlugin: pluginManager.runPlugin,
        runPlugins: pluginManager.runPlugins
      }
    })

    return true
  }
}


export default CliManager