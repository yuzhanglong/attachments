/*
 * File: HelloWorld.ts
 * Description: 一个 hello world plugin
 * Created: 2021-2-22 13:22:47
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as path from 'path'
import { Construction, Inquiry, Script, SerendipityPlugin } from '@attachments/serendipity-scripts'
import { ConstructionOptions } from '@attachments/serendipity-scripts/bin/types/pluginExecute'

@SerendipityPlugin('HelloWorldPlugin')
class HelloWorldPlugin {
  @Script('start')
  start() {
    console.log('start command has been called!')
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
  tryConstruction(options: ConstructionOptions) {
    // 质询的结果会在这里提示
    console.log(options.inquiryResult)
    if (options.inquiryResult.loveNode) {
      console.log('用户喜欢 node.js!')
    } else {
      console.log('用户不喜欢 node.js!')
    }

    options.renderTemplate(path.resolve(__dirname, 'helloTemplate'))

    options.appManager.packageManager.mergeIntoCurrent({
      dependencies: {
        axios: 'latest'
      }
    })
  }
}

export default HelloWorldPlugin