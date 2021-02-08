/*
 * File: index.ts
 * Description: service 出口
 * Created: 2021-2-4 13:18:55
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { ServiceModule } from '@attachments/serendipity-public/bin/types/cliService'

const serviceModule: ServiceModule = {
  service: require('./service'),
  inquiry: require('./inquiry')
}

module.exports = serviceModule