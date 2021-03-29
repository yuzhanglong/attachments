/*
 * File: serendipityInitPlugin.ts
 * Description: SerendipityInitPlugin
 * Created: 2021-3-1 18:56:28
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { Construction, Inquiry } from '@attachments/serendipity-core'
import { ConstructionOptions } from '@attachments/serendipity-core/lib/types/pluginExecute'
import { PluginInitOptions } from './types'

class SerendipityInitPlugin {
  @Construction()
  createPluginTemplate(options: ConstructionOptions) {
    options.appManager.packageManager.mergeIntoCurrent({
      name: `serendipity-plugin-${(options.inquiryResult as PluginInitOptions).name}`,
      main: 'lib/index.js',
      scripts: {
        'start': 'tsc -w',
        'build': 'tsc'
      },
      dependencies: {
        '@attachments/serendipity-public': 'latest',
        '@attachments/serendipity-scripts': 'latest'
      },
      files: [
        'lib',
        'templates'
      ]
    })

    // 拷贝模板
    options.renderTemplate('plugin-template')
  }

  @Inquiry()
  baseInquiry() {
    return [
      {
        type: 'input',
        message: '请输入您的 plugin 名称',
        name: 'name',
        default: 'anonymous'
      }
    ]
  }
}

export default SerendipityInitPlugin
