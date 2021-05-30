/*
 * File: constructionManager.spec.ts
 * Description: ConstructionManager 模块单元测试
 * Created: 2021-2-21 14:00:51
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as fs from 'fs'
import ConstructionManager from '../src/construction-manager'
import PresetManager from '../src/presetManager'

const mockedExeca = require('../../../__mocks__/execa')

jest.mock('execa')

describe('serviceManager 模块', () => {
  afterAll(() => {
    fsHelper.removeDir()
  })

  test('installPluginsFromPresets - plugin 信息是否正确写入 package.json', async () => {
    const cs = new ConstructionManager(fsHelper.path)
    // eslint-disable-next-line no-undef
    const pm = new PresetManager(fsHelper.path)
    pm.initPresetByObject({
      plugins: [
        {
          name: '@attachments/serendipity-plugin-react'
        },
        {
          name: '@attachments/serendipity-plugin-eslint'
        }
      ]
    })
    await cs.installPluginsFromPresets(pm.getPreset())

    const res = fs.readFileSync(fsHelper.resolve('package.json'))

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

  test('移除一个或者多个插件', async () => {
    const cs = new ConstructionManager(fsHelper.path)
    await cs.removePlugin('111', '222', '333')
    expect(mockedExeca.getCommands())
      .toStrictEqual([
        'yarn remove 111',
        'yarn remove 222',
        'yarn remove 333'
      ])
  })

  test('写入 App 配置', async () => {
    await ConstructionManager.writeAppConfig(fsHelper.path)
    const f = fs.readFileSync(fsHelper.resolve('serendipity.js')).toString()
    expect(f).toStrictEqual('module.exports = undefined')
  })
})
