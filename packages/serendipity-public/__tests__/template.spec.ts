/*
 * File: template.spec.ts
 * Description: 模板处理相关单元测试
 * Created: 2021-2-25 22:48:55
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as fs from 'fs'
import { renderTemplate , generateTempPathInfo } from '../src'


describe('模板处理相关', () => {
  const fsHelper = generateTempPathInfo()

  afterAll(() => {
    fsHelper.removeDir()
  })

  test('渲染并写入模板', async () => {
    fs.mkdirSync(fsHelper.resolve('hello'))
    fs.mkdirSync(fsHelper.resolve('world'))
    fs.writeFileSync(fsHelper.resolve('hello/foo'), '111')
    await renderTemplate(fsHelper.resolve('hello'), {}, fsHelper.resolve('world'))
    await renderTemplate(fsHelper.resolve('hello'), null, fsHelper.resolve('world'))
    expect(fs.existsSync(fsHelper.resolve('hello/foo'))).toBeTruthy()
  })
})
