/*
 * File: prePush.js
 * Description: 在 git push 前做些什么
 * Created: 2021-2-15 16:10:32
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


const { runEsLint } = require('./public')

const prePush = () => {
  runEsLint()
}

prePush()
