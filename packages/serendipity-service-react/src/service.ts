/*
 * File: index.ts
 * Description: React Service 入口文件
 * Created: 2021-1-29 13:28:53
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { ServiceOption } from '@attachments/serendipity-public/bin/types/cliService'
import { ReactServiceInquire } from './types/common'


module.exports = ({ operations }: ServiceOption) => {

  // 初始化包配置
  operations.setPackageConfig({
    name: 'test',
    version: '1.0.0',
    description: 'a react cli demo',
    main: 'index.js',
    scripts: {
      start: 'serendipity-service-react start',
      build: 'serendipity-service-react build'
    },
    author: 'serendipity',
    license: 'MIT',
    devDependencies: {
      '@attachments/serendipity-service-react': '^0.0.5'
    }
  })

  // 注册默认的 react-plugin
  operations.registerPlugin(
    '@attachments/serendipity-plugin-react',
    require('@attachments/serendipity-plugin-react')
  )

  // babel 配置插件
  operations.registerPlugin(
    '@attachments/serendipity-plugin-babel',
    require('@attachments/serendipity-plugin-babel')
  )

  // 用户选择使用 eslint, 注册 eslint 相关插件
  if ((operations.inquireResult as ReactServiceInquire).eslintSupport) {
    operations.registerPlugin(
      '@attachments/serendipity-plugin-eslint',
      require('@attachments/serendipity-plugin-eslint')
    )
  }
}
