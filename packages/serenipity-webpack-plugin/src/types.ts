/*
 * File: types.ts
 * Description: 类型声明
 * Created: 2021-2-10 20:42:08
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as webpack from 'webpack'

export interface ChunkInfo {
  files: string[]
  size: number
}

export type WebpackError = webpack.WebpackError
export type WebpackStats = webpack.Stats
export type ProblemType = 'errors' | 'warnings'


export interface ProblemInfo {
  message: string
  name: string
  webpackError: WebpackError
  errorStack: unknown[]
}