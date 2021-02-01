/*
 * File: template.ts
 * Description: babel 模板能力插件
 * Created: 2021-1-30 19:54:53
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { PluginTemplateOptions } from '@attachments/serendipity-public/bin/types/plugin'

module.exports = (options: PluginTemplateOptions) => {
  // TODO: 结合 React 来配置，可参考 create-react-app
  options.mergePackageConfig({
    babel: {
      presets: ['test']
    },
    dependencies: {
      'core-js': '^3.8.1'
    }
  })
}