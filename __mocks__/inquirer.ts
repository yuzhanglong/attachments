/*
 * File: inquirer.ts
 * Description: inquirer mock
 * Created: 2021-2-21 20:59:06
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

interface Question {
  name: string
  default: string
}

const inquirer = {
  prompt: async (questions: Question[]) => {
    const base = {}
    questions.forEach(res => {
      if (res.name) {
        base[res.name] = res.default
      }
    })
    return base
  }
}

module.exports = inquirer