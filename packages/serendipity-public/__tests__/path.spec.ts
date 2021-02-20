/*
 * File: path.spec.ts
 * Description: 路径相关测试
 * Created: 2021-2-16 10:13:44
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as path from 'path'
import { serendipityEnv } from '@attachments/serendipity-public'
import { appBuild, resolveAppPath } from '../src/utils/paths'


describe('app 路径相关测试', () => {
  beforeEach(() => {
    serendipityEnv.setSerendipityDevelopment()
  })
  test('构造 app 子路径', () => {
    expect(appBuild).toStrictEqual(path.resolve(process.cwd(), 'build'))
    const indexPath = resolveAppPath('public/index.html')
    expect(indexPath).toStrictEqual(path.resolve(process.cwd(), 'public/index.html'))
  })

  test('以 / 开头的路径应该被转化成相对路径', () => {
    // 以 / 开头，默认跳转到根路径，在这个场景下没有意义
    const indexPath = resolveAppPath('/public/index.html')
    const indexPath2 = resolveAppPath('////public/index.html')
    expect(indexPath).toStrictEqual(indexPath2)
  })

  test('以 . 作为参数', () => {
    const indexPath = resolveAppPath('.')
    expect(indexPath).toStrictEqual(path.resolve(process.cwd(), '.'))
  })
})