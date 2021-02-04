/*
 * File: inquirer.ts
 * Description: react service 项目质询
 * Created: 2021-2-4 12:46:59
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { InquireResult } from '@attachments/serendipity-public/bin/types/common'

module.exports = (): InquireResult => {
  return [
    {
      type: 'input',
      name: 'name',
      message: '同学好~ 请输入你的姓名：'
    },
    {
      type: 'checkbox',
      name: 'favor',
      choices: ['JavaScript', 'TypeScript', 'Java', 'Python', 'Golang'],
      message: '请选择你感兴趣的语言',
      default: 'TypeScript'
    }
  ]
}