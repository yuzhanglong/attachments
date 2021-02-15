/*
 * File: base.js
 * Description: git hook 公用模块
 * Created: 2021-2-15 16:03:14
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

const fs = require('fs')
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

  return execa.sync(
    command,
    args,
    {
      cwd: p,
      stdio: 'inherit'
    }
  )
}

const runEsLint = () => {
  console.log('===== 执行 eslint =====')
  runCommandSync('yarn lint')
}

const runJestTest = () => {
  console.log('===== 执行单元测试 =====')
  runCommandSync('yarn test')
}

const checkCommitMessage = (path) => {
  console.log('===== 验证 commit message =====')
  runCommandSync(`commitlint -e ${path}`)
}

const addEmojiToCommit = (oldMessage) => {
  const MESSAGE_MAPPER = {
    'docs': ':memo:',
    'fix': ':bug:',
    'build': ':pencil2:',
    'merge': ':twisted_rightwards_arrows:',
    'chore': ':monocle_face:',
    'ci': ':construction_worker:',
    'feat': ':sparkles:',
    'perf': ':zap:',
    'refactor': ':recycle:',
    'revert': ':rewind:',
    'style': ':art:',
    'test': ':white_check_mark:'
  }
  // 此时的 message 已经校验过了，故只需要添加表情即可, 如果不存在，我们不作处理
  const data = oldMessage.split(' ')
  const keys = Object.keys(MESSAGE_MAPPER)
  const acceptKey = keys.filter(key => data[0].indexOf(key.toLowerCase()) >= 0)
  if (acceptKey.length <= 0) {
    return oldMessage
  }
  return `${MESSAGE_MAPPER[acceptKey]} ${oldMessage}`
}

const editCommitMessageEmoji = (path, oldMessage) => {
  const newMessage = addEmojiToCommit(oldMessage)
  fs.writeFileSync(path, newMessage)
}

module.exports = {
  runCommandSync,
  runEsLint,
  runJestTest,
  checkCommitMessage,
  editCommitMessageEmoji
}