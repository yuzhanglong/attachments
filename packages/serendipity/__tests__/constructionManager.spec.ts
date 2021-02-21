/*
 * File: constructionManager.spec.ts
 * Description: ConstructionManager 模块单元测试
 * Created: 2021-2-21 14:00:51
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as path from 'path'
import * as fs from 'fs'
import ConstructionManager from '../src/constructionManager'

const mockedExeca = require('../../../__mocks__/execa')


describe('serviceManager 模块', () => {
  test('installPluginsFromPresets - plugin 信息是否正确写入 package.json', async () => {

    jest.mock('fs')
    jest.mock('execa')

    const base = path.resolve('/')
    const cs = new ConstructionManager(base, {})
    await cs.initPreset({
      plugins: [
        {
          name: '@attachments/serendipity-plugin-react'
        },
        {
          name: '@attachments/serendipity-plugin-eslint',
          overrideInquiry: {
            foo: 'foo'
          }
        }
      ]
    })
    await cs.installPluginsFromPresets()

    const res = fs.readFileSync('/package.json')

    expect(JSON.parse(res.toString())).toStrictEqual({
      'name': 'serendipity-project',
      'version': '1.0.0',
      'main': 'index.js',
      'license': 'MIT',
      'dependencies': {
        '@attachments/serendipity-plugin-react': 'latest',
        '@attachments/serendipity-plugin-eslint': 'latest'
      }
    })

    // 一次 yarn install 被执行
    expect(mockedExeca.getCommands())
      .toStrictEqual([
        'yarn install'
      ])
  })

  test('初始化预设（本地文件模式 / http 模式）', async () => {
    // TODO: 可以考虑临时起个测试服务器？这里暂时先用 CDN 代替了
    const cm = new ConstructionManager(
      path.resolve(process.cwd(), 'playground'),
      {
        preset: 'http://cdn.yuzzl.top/reactApp.js'
      }
    )
    await cm.initPreset()
    expect(cm.getPreset()).toStrictEqual({
      'plugins': [
        {
          'name': '@attachments/serendipity-plugin-react'
        },
        {
          'name': '@attachments/serendipity-plugin-eslint'
        }
      ]
    })

    fs.unlinkSync(
      path.resolve(process.cwd(), 'playground/serendipityPreset.js')
    )
  })
})