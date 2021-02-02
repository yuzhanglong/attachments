/*
 * File: paths.ts
 * Description: React 项目路径处理
 * Created: 2021-2-1 21:09:06
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as fs from 'fs'
import * as path from 'path'

// app 基础路径，即执行路径
const appBaseUrl = fs.realpathSync(process.cwd())

// 获取基础路径下的子路径
const resolveAppPath = (target: string): string => {
  // 以 / 开头，默认跳转到根路径，在这个场景下没有意义，不妨在这里将其删除
  while (target.startsWith('/')) {
    target = target.slice(1)
  }
  return path.resolve(appBaseUrl, target)
}

// 构建结果目录
const appBuild = resolveAppPath('build')

// package.json
const appPackageJson = resolveAppPath('package.json')

// src 目录
const appSource = resolveAppPath('src')

// yarn.lock
const appYarnLockFile = resolveAppPath('yarn.lock')

// HTML
const appHtml = resolveAppPath('public/index.html')

// 配置目录
const configFile = resolveAppPath('serendipity.js')


const appEntry = resolveAppPath('src/index.js')

export {
  resolveAppPath,
  appBuild,
  appPackageJson,
  appSource,
  appYarnLockFile,
  appHtml,
  configFile,
  appEntry
}