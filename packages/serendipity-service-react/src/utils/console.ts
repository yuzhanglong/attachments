/*
 * File: console.ts
 * Description: 命令行相关工具
 * Created: 2021-2-9 23:45:34
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as readline from 'readline'


// 清空终端
export const clearConsole = (): void => {
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)
}
