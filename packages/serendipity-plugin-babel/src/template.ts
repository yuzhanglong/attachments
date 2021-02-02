/*
 * File: template.ts
 * Description: babel 模板能力插件
 * Created: 2021-1-30 19:54:53
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { PluginTemplateOptions } from '@attachments/serendipity-public/bin/types/plugin'

module.exports = (options: PluginTemplateOptions) => {
  options.mergePackageConfig({
    babel: {
      'presets': [
        '@babel/env',
        [
          '@babel/preset-react'
        ]
      ]
    }
  })
}