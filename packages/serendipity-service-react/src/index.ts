/*
 * File: index.ts
 * Description: React Service 入口文件
 * Created: 2021-1-29 13:28:53
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { ServiceOption } from '@attachments/serendipity-public/bin/types/cliService'


module.exports = ({ operations }: ServiceOption) => {
  operations.setPackageConfig({
    name: 'test',
    version: '1.0.0',
    description: 'a react cli demo',
    main: 'index.js',
    scripts: {
      start: 'cli-react-service start',
      build: 'cli-react-service build'
    },
    author: 'yuzhanglong',
    license: 'ISC',
    devDependencies: {
      'cli-service-react': 'latest'
    }
  })

  operations.runPluginTemplate(
    require('@attachments/serendipity-plugin-react')
  )

}

