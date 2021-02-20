/*
 * File: container.ts
 * Description: IOC 容器
 * Created: 2021-2-19 21:32:09
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { logger } from '@attachments/serendipity-public'
import { PluginMetaData } from '../types/common'

const pluginMetaData: PluginMetaData = {
  command: []
}

class Container {
  private readonly instances: Map<symbol, PluginMetaData>

  constructor() {
    this.instances = new Map<symbol, PluginMetaData>()
  }

  runCommand(script: string): void {
    for (const commandMetaItem of pluginMetaData.command) {
      if (typeof script === 'string' && commandMetaItem.command === script) {
        this.instances[commandMetaItem.propertyKey](script)
        return
      }
    }
    // 在这里并没有已经注册过的 scripts 匹配，我们打出记录
    logger.error(`命令 ${script} 不存在于任何一个 plugin 中，请检查...`)
  }
}

const containerInstance = new Container()

export default containerInstance