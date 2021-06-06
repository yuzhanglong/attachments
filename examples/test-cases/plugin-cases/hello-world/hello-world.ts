/*
 * File: HelloWorld.ts
 * Description: 一个 hello world plugin，供测试使用
 * Created: 2021-2-22 13:22:47
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as path from 'path'
import { SerendipityPlugin, Construction, Inquiry } from '@attachments/serendipity-core'
import { ConstructionOptions } from '@attachments/serendipity-core/lib/types/pluginExecute'


interface HelloWorldOptions {
  name: string
  age: string
}

@SerendipityPlugin('HelloWorldPlugin')
class HelloWorldPlugin {
  private readonly name: string
  private readonly age: string

  // 参数，注意: 在 runtime 环境下这个值会被传入, 在构建环境下这个值为空
  constructor(options: HelloWorldOptions) {
    this.name = options.name
    this.age = options.age
  }

  @Inquiry()
  inquiry() {
    return [
      {
        type: 'confirm',
        name: 'loveNode',
        message: '你喜欢 node.js 吗',
        default: true
      }
    ]
  }

  @Construction()
  async tryConstruction(options: ConstructionOptions) {
    // 质询的结果会在这里提示
    console.log(options.inquiryResult)
    if ((options.inquiryResult as Record<string, unknown>).loveNode) {
      console.log('用户喜欢 node.js!')
    } else {
      console.log('用户不喜欢 node.js!')
    }

    await options.renderTemplate('hello-template')

    options.appManager.packageManager.mergeIntoCurrent({
      dependencies: {
        axios: 'latest'
      }
    })
  }
}

export default HelloWorldPlugin
