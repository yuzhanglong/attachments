/*
 * File: template.js
 * Description: 模板处理，一般用于项目构建时使用
 * Created: 2021-1-23 17:03:05
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { PluginTemplateOptions } from '@attachments/serendipity-public/bin/types/plugin'
import { ReactServiceInquire } from '@attachments/serendipity-service-react/bin/types/common'
import * as path from 'path'


const getTemplatePath = (name) => {
  return path.resolve(__dirname, '../templates', name)
}


module.exports = (options: PluginTemplateOptions) => {
  // 拷贝模板到工作目录下
  options.render(getTemplatePath('react-template'), {})

  // 合并 app 配置
  // TODO: 将这部分抽离到 service 层来统一写入，plugins 不归这里管！
  options.mergeAppConfig({
    plugins: [
      '@attachments/serendipity-plugin-babel',
      '@attachments/serendipity-plugin-react',
      '@attachments/serendipity-plugin-eslint'
    ]
  })

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