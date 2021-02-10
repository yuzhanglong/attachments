/*
 * File: serendipityWebpackPlugin.ts
 * Description: serendipityWebpackPlugin 用来让控制台输出更加美观
 * Created: 2021-2-9 18:47:23
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as readline from 'readline'
import { logger } from '@attachments/serendipity-public'
import * as webpack from 'webpack'
import * as ErrorStackParser from 'error-stack-parser'
import * as boxen from 'boxen'
import { getChunkInfo, uniqueBy } from './utils'
import { ChunkInfo, ProblemInfo, ProblemType, WebpackError, WebpackStats } from './types'

const Table = require('cli-table')

class SerendipityWebpackPlugin {
  private readonly serverPort
  private readonly analysisPort

  constructor(serverPort?: number, analysisPort?: number) {
    this.serverPort = serverPort || 9000
    this.analysisPort = analysisPort || 9001
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
   * @date 2021-2-10 12:23:21
   */
  resolveProblems(stats: WebpackStats, type: ProblemType): WebpackError [] {
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
   * @date 2021-2-10 12:23:21
   */
  showProblems(problems: WebpackError [], type: ProblemType): void {
    logger.info('o(TωT)o 请解决下面的 bug:\n')

    // TODO: 优化封装这部分数据结构
    const errors = problems.map(res => {
      return {
        message: res.message,
        name: res.name,
        webpackError: res,
        errorStack: res.stack ? ErrorStackParser.parse(res) : []
      } as ProblemInfo
    })

    errors.forEach(res => {
      type === 'warnings' ? logger.warn(res.name + ':') : logger.error(res.name + ':')
      console.log(`${res.message}\n\n`)
    })
  }

  /**
   * 当 webpack 构建完成时做些什么
   *
   * @author yuzhanglong
   * @param stats webpack 构建状态
   * @date 2021-2-10 12:22:56
   */
  onWebpackDone(stats: WebpackStats): void {
    this.clearConsole()
    const hasError = stats.hasErrors()
    const hasWarnings = stats.hasWarnings()

    // 没有出现错误，我们显示一个成功信息，并 return
    if (!hasError && !hasWarnings) {
      this.onWebpackSuccess(stats)
      return
    }

    if (hasError) {
      const problems = this.resolveProblems(stats, 'errors')
      this.showProblems(problems, 'errors')
      return
    }

    if (hasWarnings) {
      const problems = this.resolveProblems(stats, 'warnings')
      this.showProblems(problems, 'warnings')
      return
    }
  }

  /**
   * 当 webpack 构建时做些什么
   *
   * @author yuzhanglong
   * @date 2021-2-10 13:08:20
   */
  onWebpackInvalid(): void {
    this.clearConsole()
    logger.info('(〃\'▽\'〃) 项目正在构建中，请稍候...')
  }

  /**
   * 当 webpack 构建完成且没有任何错误和警告时做些什么
   *
   * @author yuzhanglong
   * @param stats webpack 状态对象
   * @date 2021-2-10 13:11:11
   */
  onWebpackSuccess(stats: WebpackStats): void {
    // 时间消耗
    const timeCost = stats.endTime - stats.startTime
    logger.done('Compile successfully!')
    // TODO: 除了 port 不能写死，前面的 ip 也不可以写死
    console.log(
      boxen(
        `ヾ(๑╹◡╹)ﾉ" 项目构建成功! (耗时：${timeCost} ms)\n\n项目运行地址：http://127.0.0.1:${this.serverPort}\n查看 webpack 打包分析：http://127.0.0.1:${this.analysisPort}`,
        { padding: 1 }
      )
    )
    const table = new Table({
      head: ['文件名', '大小']
    })

    const chunksInfo = (stats.toJson().chunks) as ChunkInfo[]
    table.push(...getChunkInfo(chunksInfo, 10))
    console.log('')
    logger.info('资源清单如下：')
    console.log(table.toString())
  }


  /**
   * webpackPlugin Apply 入口
   *
   * @author yuzhanglong
   * @date 2021-2-10 12:23:42
   */
  apply(compiler: webpack.Compiler): void {
    // TODO: 执行父类以复用 processPlugin 显示打包进度
    // 不知道这里为什么 compiler 前后不一致，猜测版本兼容性问题
    // new ProgressPlugin(() => {
    //   console.log('111')
    // }).apply(compiler)

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