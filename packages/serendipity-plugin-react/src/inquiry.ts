/*
 * File: inquirer.ts
 * Description: react plugin 项目质询
 * Created: 2021-2-13 23:37:44
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { inquirer } from '@attachments/serendipity-public'

module.exports = (): inquirer.QuestionCollection => {
  return [
    {
      type: 'list',
      message: '请选择一个开发语言',
      name: 'language',
      choices: [
        'JavaScript',
        'TypeScript'
      ],
      default: 'JavaScript'
    }
  ]
}