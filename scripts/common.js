/*
 * File: common.ts
 * Description: 公共工具函数集合
 * Created: 2021-2-15 22:03:44
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

const execa = require('execa')

 const runCommandSync = (command, args, path) => {
  let p = path
  if (!p) {
    p = process.cwd()
  }
  if (!args) {
    // \s 匹配任何空白字符，包括空格、制表符、换页符
    [command, ...args] = command.split(/\s+/)
  }

  // eslint-disable-next-line import/namespace
  return execa.sync(
    command,
    args,
    {
      cwd: p,
      stdio: 'inherit'
    }
  )
}

module.exports = {
  runCommandSync
}