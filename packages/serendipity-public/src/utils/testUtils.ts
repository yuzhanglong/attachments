/*
 * File: testUtils.ts
 * Description: 测试工具集合
 * Created: 2021-2-27 14:08:15
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as path from 'path'
import * as fs from 'fs-extra'

export const initTestDir = () => {
  const testRootDir = path.resolve(process.cwd(), 'playground', 'test')
  // 移除旧的目录
  fs.removeSync(testRootDir)
  // 建立新的工作目录
  fs.mkdirpSync(testRootDir)
}
