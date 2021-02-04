/*
 * File: index.ts
 * Description: React Service 入口文件
 * Created: 2021-1-29 13:28:53
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { ServiceOption } from '@attachments/serendipity-public/bin/types/cliService'


module.exports = ({ operations }: ServiceOption) => {
  // 初始化包配置
  operations.setPackageConfig({
    name: 'test',
    version: '1.0.0',
    description: 'a react cli demo',
    main: 'index.js',
    scripts: {
      start: 'serendipity-service-react start'
    },
    author: 'serendipity',
    license: 'ISC',
    devDependencies: {
      'serendipity-service-react': '../../packages/serendipity-service-react'
    }
  })

  // 初始化模板
  operations.registerPlugin(
    require('@attachments/serendipity-plugin-react')
  )

  // babel 配置插件
  operations.registerPlugin(
    require('@attachments/serendipity-plugin-babel')
  )
}
