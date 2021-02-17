/*
 * File: index.ts
 * Description: React Service 入口文件
 * Created: 2021-1-29 13:28:53
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { ServiceOption } from '@attachments/serendipity-public/bin/types/cliService'
import { ReactServiceInquire } from './types/common'

module.exports = (options: ServiceOption) => {
  // 初始化包配置
  options.setPackageConfig({
    name: 'react-project',
    version: '0.0.1',
    description: 'a react project created by serendipity',
    main: 'index.js',
    scripts: {
      start: 'serendipity-service-react start',
      build: 'serendipity-service-react build'
    },
    author: 'serendipity',
    license: 'MIT',
    dependencies: {
      '@attachments/serendipity-service-react': require('../package.json').version
    }
  })

  // 注册默认的 react-plugin
  options.registerPlugin('@attachments/serendipity-plugin-react', require('D:\\projects\\serendipity\\packages\\serendipity-plugin-react'))

  // babel 配置插件
  options.registerPlugin('@attachments/serendipity-plugin-babel', require('D:\\projects\\serendipity\\packages\\serendipity-plugin-babel'))

  // 如果用户选择使用 eslint, 注册 eslint 相关插件
  if ((options.inquiryResult as unknown as ReactServiceInquire)?.eslintSupport) {
    options.registerPlugin(
      '@attachments/serendipity-plugin-eslint',
      require('D:\\projects\\serendipity\\packages\\serendipity-plugin-eslint')
    )
  }
}
