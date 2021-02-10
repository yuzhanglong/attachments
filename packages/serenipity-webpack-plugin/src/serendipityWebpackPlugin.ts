/*
 * File: serendipityWebpackPlugin.ts
 * Description: serendipityWebpackPlugin 用来让控制台输出更加美观
 * Created: 2021-2-9 18:47:23
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as readline from 'readline'
import { ProgressPlugin } from 'webpack'
import { logger } from '@attachments/serendipity-public'
import * as webpack from 'webpack'
import { uniqueBy } from './utils'


type WebpackError = webpack.WebpackError

class SerendipityWebpackPlugin extends ProgressPlugin {
  constructor() {
    super({ activeModules: true })
  }

  static PLUGIN_INFO = {
    name: 'SerendipityWebpackPlugin'
  }

  clearConsole(): void {
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
  }

  /**
   * 提取问题 / 警告
   *
   * @author yuzhanglong
   * @email yuzl1123@163.com
   * @date 2021-2-10 12:23:21
   */
  resolveProblems(stats: webpack.Stats, type: 'errors' | 'warnings'): WebpackError [] {
    const findErrorsRecursive = (compilation): WebpackError [] => {
      const errors = compilation[type]
      if (errors.length === 0 && compilation.children) {
        for (const child of compilation.children) {
          errors.push(...findErrorsRecursive(child))
        }
      }
      // 过滤数组
      return uniqueBy<WebpackError>(errors, error => error.message)
    }

    return findErrorsRecursive(stats.compilation)
  }

  /**
   * 展示问题 / 警告
   *
   * @author yuzhanglong
   * @email yuzl1123@163.com
   * @date 2021-2-10 12:23:21
   */
  showProblems(problems: WebpackError []): void {
    console.log(problems)
  }

  /**
   * 当 webpack 构建完成是做些什么
   *
   * @author yuzhanglong
   * @email yuzl1123@163.com
   * @date 2021-2-10 12:22:56
   */
  onWebpackDone(stats: webpack.Stats): void {
    this.clearConsole()
    const hasError = stats.hasErrors()
    const hasWarnings = stats.hasWarnings()

    // 没有出现错误，我们显示一个成功信息，并 return
    if (!hasError && !hasWarnings) {
      logger.done('项目构建完成!')
      return
    }

    if (hasError) {
      const problems = this.resolveProblems(stats, 'errors')
      this.showProblems(problems)
      return
    }

    if (hasWarnings) {
      const problems = this.resolveProblems(stats, 'warnings')
      this.showProblems(problems)
      return
    }
  }


  onWebpackInvalid(): void {
    this.clearConsole()
    logger.info('项目正在构建中，请稍候...')
  }


  /**
   * webpackPlugin Apply 入口
   *
   * @author yuzhanglong
   * @email yuzl1123@163.com
   * @date 2021-2-10 12:23:42
   */
  apply(compiler: webpack.Compiler): void {
    if (compiler.hooks) {
      // 在 webpack 构建完成时做些什么
      compiler.hooks.done.tap(
        SerendipityWebpackPlugin.PLUGIN_INFO,
        this.onWebpackDone.bind(this)
      )

      compiler.hooks.invalid.tap(
        SerendipityWebpackPlugin.PLUGIN_INFO,
        this.onWebpackInvalid.bind(this)
      )
    }
  }
}

module.exports = SerendipityWebpackPlugin