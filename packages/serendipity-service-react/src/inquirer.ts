/*
 * File: inquirer.ts
 * Description: react service 项目质询
 * Created: 2021-2-4 12:46:59
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { InquiryResult } from '@attachments/serendipity-public/bin/types/common'

module.exports = (): InquiryResult => {
  return [
    {
      type: 'confirm',
      name: 'eslintSupport',
      message: '增加 eslint 支持',
      default: true
    }
  ]
}