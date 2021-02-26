/*
 * File: template.spec.ts
 * Description: 模板处理相关单元测试
 * Created: 2021-2-25 22:48:55
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as fs from 'fs'
import { renderTemplate } from '../src'

jest.mock('fs')

describe('模板处理相关', () => {
  test('渲染并写入模板', async () => {
    fs.mkdirSync('/hello')
    fs.mkdirSync('/world')
    fs.mkdirSync('/wow')
    fs.writeFileSync('/hello/foo', '111')
    fs.writeFileSync('/hello/bar', '222')
    await renderTemplate('/hello', {}, '/world')
    expect(fs.existsSync('/world/foo')).toBeTruthy()
    expect(fs.existsSync('/world/bar')).toBeTruthy()
    await renderTemplate('/hello', null, '/wow')
    expect(fs.existsSync('/wow/foo')).toBeTruthy()
    expect(fs.existsSync('/wow/bar')).toBeTruthy()
  })
})