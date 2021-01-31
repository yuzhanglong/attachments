/*
 * File: logger.ts
 * Description: 终端打印模块
 * Created: 2021-1-29 21:57:06
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as chalk from 'chalk'


class Logger {
  public log(message): void {
    console.log(message)
  }

  public info(message): void {
    console.log(chalk.bgBlue.black(' INFO ') + ' ' + message)
  }

  public done(message): void {
    console.log(chalk.bgGreen.black(' DONE ') + ' ' + message)
  }

  public warn(message: string): void {
    console.log(chalk.bgYellow.black(' WARN ') + ' ' + message)
  }

  public error(message: string): void {
    console.log(chalk.bgRed(' ERROR ') + ' ' + message)
  }
}


const logger = new Logger()

export default logger