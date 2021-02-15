/*
 * File: common.ts
 * Description: 公共工具函数集合
 * Created: 2021-2-15 22:03:44
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as execa from 'execa'

export const runCommandSync = (command: string, args?: string[], path?: string) => {
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

export const runEsLint = (): void => {
  console.log('===== 执行 eslint =====')
  runCommandSync('yarn lint')
}

export const runJestTest = (): void => {
  console.log('===== 执行单元测试 =====')
  runCommandSync('yarn test')
}

export const checkCommitMessage = (path: string): void => {
  console.log('===== 验证 commit message =====')
  runCommandSync(`commitlint -e ${path}`)
}