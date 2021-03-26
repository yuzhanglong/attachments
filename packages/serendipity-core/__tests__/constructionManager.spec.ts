/*
 * File: constructionManager.spec.ts
 * Description: ConstructionManager 模块单元测试
 * Created: 2021-2-21 14:00:51
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as fs from 'fs'
import { generateTempPathInfo } from '@attachments/serendipity-public'
import ConstructionManager from '../src/constructionManager'
import PresetManager from '../src/presetManager'

const mockedExeca = require('../../../__mocks__/execa')

jest.mock('execa')

describe('serviceManager 模块', () => {
  const fsHelper = generateTempPathInfo()

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
})
