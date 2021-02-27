/*
 * File: testUtils.ts
 * Description: 测试工具集合
 * Created: 2021-2-27 14:08:15
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as path from 'path'
import * as fs from 'fs-extra'

/**
 * 生成一个临时目录供测试使用，由于 jest 在执行多个 .spec 的时候是并行操作的，而单个则是串行
 * 如果大家都共享一个目录必然会造成一些冲突（例如 A 还在测试，B 测试完了结果把这个目录给删了）
 * 最终我们返回一个对象，这个对象包括：临时目录路径
 *
 * @author yuzhanglong
 * @email yuzl1123@163.com
 * @return 一个对象，包括三个成员
 * - path: 结果路径
 * - resolve path.resolve 基于结果路径的快捷方法
 * - clear 清空临时目录
 * @date 2021-2-27 19:11:10
 */
export const generateTempPathInfo = () => {
  const tmpName = new Date().getTime().toString()
  const testRootDir = path.resolve(process.cwd(), 'playground', 'test', tmpName)

  // 建立新的工作目录
  fs.ensureDirSync(testRootDir)

  return {
    path: testRootDir,
    resolve: (...names: string[]) => path.resolve(testRootDir, ...names),
    clear: () => fs.emptydirSync(testRootDir),
    removeDir: () => fs.removeSync(testRootDir)
  }
}
