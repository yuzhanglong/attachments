/*
 * File: template.js
 * Description: 模板处理，一般用于项目构建时使用
 * Created: 2021-1-23 17:03:05
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as path from 'path'
import { PluginTemplateOptions } from '@attachments/serendipity-public/bin/types/plugin'
import { ReactServiceInquire } from '@attachments/serendipity-service-react/bin/types/common'


const getTemplatePath = (name) => {
  return path.resolve(__dirname, '../templates', name)
}


module.exports = (options: PluginTemplateOptions) => {
  // 拷贝模板到工作目录下
  options.render(getTemplatePath('react-template'))

  // 开启 sass 支持，将 sass 编译所需要的模块注入到用户的 package.json 中
  if ((options.inquireResult as ReactServiceInquire).sassSupport) {
    options.mergePackageConfig({
      dependencies: {
        'node-sass': '^5.0.0',
        'sass-loader': '^10.1.1'
      }
    })
  }
}