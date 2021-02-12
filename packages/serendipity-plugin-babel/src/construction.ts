/*
 * File: template.ts
 * Description: babel 模板能力插件
 * Created: 2021-1-30 19:54:53
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { PluginConstructionOptions } from '@attachments/serendipity-public/bin/types/plugin'

module.exports = (options: PluginConstructionOptions) => {
  // 必须放在用户的 package.json 否则使用 eslint 时会出 bug
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