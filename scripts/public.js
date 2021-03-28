const { runCommandSync } = require('./common')

const runEsLint = () => {
  console.log('===== 执行 eslint =====')
  runCommandSync('yarn lint')
}

const runJestTest = () => {
  console.log('===== 执行单元测试 =====')
  runCommandSync('yarn test')
}

module.exports = {
  runEsLint,
  runJestTest
}