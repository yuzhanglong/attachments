/*
 * File: preCommit.js
 * Description: 在 commit 前做些什么
 * Created: 2021-2-15 15:46:27
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


const { runEsLint } = require('./public')

const preCommit = () => {
  runEsLint()
}

preCommit()
