/*
 * File: template.spec.ts
 * Description: 模板处理相关单元测试
 * Created: 2021-2-25 22:48:55
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as fs from 'fs'
import * as path from 'path'
import { initTestDir } from '@attachments/serendipity-public/bin/utils/testUtils'
import { playgroundTestPath } from '@attachments/serendipity-public/bin/utils/paths'
import { renderTemplate } from '../src'


describe('模板处理相关', () => {
  beforeEach(() => {
    initTestDir()
  })

  test('渲染并写入模板', async () => {
    fs.mkdirSync(path.resolve(playgroundTestPath, 'hello'))
    fs.mkdirSync(path.resolve(playgroundTestPath, 'world'))
    fs.writeFileSync(path.resolve(playgroundTestPath, 'hello/foo'), '111')
    await renderTemplate(path.resolve(playgroundTestPath, 'hello'), {}, path.resolve(playgroundTestPath, 'world'))
    await renderTemplate(path.resolve(playgroundTestPath, 'hello'), null, path.resolve(playgroundTestPath, 'world'))
    expect(fs.existsSync(path.resolve(playgroundTestPath, 'hello/foo'))).toBeTruthy()
  })
})
