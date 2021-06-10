/*
 * File: template.spec.ts
 * Description: 模板处理相关单元测试
 * Created: 2021-2-25 22:48:55
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as fs from 'fs'
import { renderTemplate, fsMock } from '../src'


describe('模板处理相关', () => {
  test('渲染并写入模板', async () => {
    const fsHelper = fsMock({
      hello: {
        foo: '111'
      },
      world: {}
    })

    await renderTemplate(fsHelper.resolve('hello'), {}, fsHelper.resolve('world'))
    await renderTemplate(fsHelper.resolve('hello'), null, fsHelper.resolve('world'))
    expect(fs.existsSync(fsHelper.resolve('world/foo'))).toBeTruthy()
  })

  test('当文件名以 __ 开头时，我们以一个点号替换之', async () => {
    const fsHelper = fsMock({
      foo: {
        __hello: 'hello world!'
      },
      bar: {}
    })

    await renderTemplate(fsHelper.resolve('foo'), {}, fsHelper.resolve('bar'))
    expect(fs.existsSync(fsHelper.resolve('bar/.hello'))).toBeTruthy()
  })
})
