/*
 * File: command.ts
 * Description: 命令行执行
 * Created: 2021-1-30 19:28:09
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as execa from 'execa'


const runCommand = async (command: string, args: string[], path?: string): Promise<execa.ExecaChildProcess> => {
  let p = path
  if (!p) {
    p = process.cwd()
  }
  if (!args) {
    // \s 匹配任何空白字符，包括空格、制表符、换页符
    [command, ...args] = command.split(/\s+/)
  }

  return execa(
    command,
    args,
    {
      cwd: p
    }
  )
}

export {
  runCommand
}