/*
 * File: execa.ts
 * Description: execa mock
 * Created: 2021-2-21 19:37:11
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

let calledCommands = []

interface ExecaMockReturn {
  getCommands?: () => string[]
}

const execa = (command: string, args: []) => {
  if (args.length) {
    command += ' ' + args.join(' ')
  }
  calledCommands.push(command)
}

execa.getCommands = () => {
  const tmp = calledCommands.slice()
  // 移除旧内容
  calledCommands = []
  return tmp
}

module.exports = execa as ExecaMockReturn
