/*
 * File: execa.ts
 * Description: execa mock
 * Created: 2021-2-21 19:37:11
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

const calledCommands = []

const execa = (command: string, args: []) => {
  if (args.length) {
    command += ' ' + args.join(' ')
  }
  calledCommands.push(command)
}

execa.getCommands = () => {
  return calledCommands
}

module.exports = execa