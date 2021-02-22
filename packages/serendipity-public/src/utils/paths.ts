/*
 * File: paths.ts
 * Description: React 项目路径处理
 * Created: 2021-2-1 21:09:06
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as fs from 'fs'
import * as path from 'path'


// React 项目入口可能的扩展名
export const REACT_ENTRY_EXTENSIONS = [
  'js',
  'mjs',
  'jsx',
  'ts',
  'tsx'
]

// app 基础路径，即执行路径
const appBaseUrl = process.cwd()

// 获取基础路径下的子路径
const resolveAppPath = (target: string): string => {
  // 以 / 开头，默认跳转到根路径，在这个场景下没有意义，不妨在这里将其删除
  while (target.startsWith('/')) {
    target = target.slice(1)
  }
  return path.resolve(appBaseUrl, target)
}


// 获取 app 入口，这个方法的意义在于处理 typescript 的项目，此时它的后缀为 ts(tsx)，所以我们不能把 entry 写死
const resolveAppEntry = (filePath, extensions?: string[]) => {
  // 查询是否有符合的扩展名入口文件
  const extension = extensions || REACT_ENTRY_EXTENSIONS
    .find(extension => {
      return fs.existsSync(resolveAppPath(`${filePath}.${extension}`))
    })

  if (extension) {
    return resolveAppPath(`${filePath}.${extension}`)
  }

  return resolveAppPath(`${filePath}.js`)
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

// app 入口
const appEntry = resolveAppEntry('src/index')

// app 根目录
const appRoot = resolveAppPath('.')

export {
  resolveAppPath,
  appBuild,
  appPackageJson,
  appSource,
  appYarnLockFile,
  appHtml,
  configFile,
  appEntry,
  appRoot
}