/*
 * File: clear.ts
 * Description: 清除构建脚本
 * Created: 2021-2-23 21:37:49
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

const fs = require('fs')
const gb = require('globby')

export const clear = () => {
  const totalFiles = gb.sync(
    ['packages/*/bin/**'],
    {
      cwd: process.cwd(),
      dot: true
    }
  )


  totalFiles.forEach(res => {
    fs.unlinkSync(res)
  })
}
