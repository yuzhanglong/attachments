/*
 * File: CliManager.ts
 * Description: 负责 cli 命令管理的模块
 * Created: 2021-1-28 20:45:40
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as fs from 'fs'
import { promisify } from 'util'
import { CreateOptions } from './types/options'
import { CliService } from '@attachments/serendipity-public/bin/types/cliService'
import PluginManager from '@attachments/serendipity-public/bin/pluginManager'
import * as process from 'process'

const writeFilePromise = promisify(fs.writeFile)

class CliManager {
  private args

  constructor(args: string[]) {
    this.args = args
  }

  async create(name: string, options: CreateOptions): Promise<void> {

    // 获取对应 project类型的 service 包
    let cliService: CliService
    try {
      cliService = require(`@attachments/serendipity-service-${options.type}`)
      // TODO: 提供自定义 service 接口，允许从其他地方导入包
    } catch (e) {
      console.log('获取 service 包失败，请检查类型是否支持！')
      process.exit(0)
    }

    // 获取包配置，并写文件
    // const packageConfig = cliService
    // const targetPath = path.resolve(process.execPath, 'package.json')
    // await writeFilePromise(targetPath, JSON.stringify(packageConfig))


    // 处理插件
    const pluginManager = new PluginManager()

    cliService({
      configurations: {},
      operations: {
        setPackageConfig: () => {
          // TODO: package.json 配置
          console.log('package.json!')
        },
        // 注意 this 指向
        runPluginTemplate: pluginManager.runPluginTemplate.bind(pluginManager),
        runPluginsTemplate: pluginManager.runPluginsTemplate.bind(pluginManager)
      }
    })
  }
}


export default CliManager