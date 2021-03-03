/*
 * File: presetManager.spec.ts
 * Description: preset 单元测试
 * Created: 2021-3-2 13:27:19
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import PresetManager from '../src/utils/presetManager'
import { PRESET_CDN_BASE_URL } from '../src/common/constant'
import { generateTempPathInfo } from '../src/utils/testUtils'

// eslint-disable-next-line max-lines-per-function
describe('preset Manager 模块测试', () => {
  const fsHelper = generateTempPathInfo()

  const mock = new MockAdapter(axios)

  mock.onGet('http://mock_preset').reply(200, 'const path = require(\'path\')\n' +
    '\n' +
    'module.exports = {\n' +
    '  plugins: [\n' +
    '    {\n' +
    '      name: \'@attachments/serendipity-plugin-react\',\n' +
    '    },\n' +
    '    {\n' +
    '      name: \'@attachments/serendipity-plugin-babel\',\n' +
    '    }\n' +
    '  ]\n' +
    '}')

  mock.onGet('http://mock_preset').reply(200, 'const path = require(\'path\')\n' +
    '\n' +
    'module.exports = {\n' +
    '  plugins: [\n' +
    '    {\n' +
    '      name: \'@attachments/serendipity-plugin-react\',\n' +
    '    },\n' +
    '    {\n' +
    '      name: \'@attachments/serendipity-plugin-babel\',\n' +
    '    }\n' +
    '  ]\n' +
    '}')

  mock.onGet(`${PRESET_CDN_BASE_URL}/react`).reply(200, 'const path = require(\'path\')\n' +
    '\n' +
    'module.exports = {\n' +
    '  plugins: [\n' +
    '    {\n' +
    '      name: \'@attachments/foo\',\n' +
    '    },\n' +
    '    {\n' +
    '      name: \'@attachments/bar\',\n' +
    '    }\n' +
    '  ]\n' +
    '}')


  mock.onGet('http://mock_preset_async_fn').reply(200, 'const axios = require("axios")\n' +
    'module.exports = async () => {\n' +
    '      const isFooPlugin = false\n' +
    '      result = await axios.get(\'http://mock_preset\')\n' +
    '      return {\n' +
    '        plugins: [\n' +
    '          {\n' +
    '            name: isFooPlugin ? \'foo-plugin\' : \'bar-plugin\'\n' +
    '          }\n' +
    '        ]\n' +
    '      }\n' +
    '    }')

  afterAll(() => {
    fsHelper.removeDir()
  })

  test('通过 preset 对象来初始化 preset', () => {
    const pm = new PresetManager(fsHelper.path)
    pm.initPresetByObject({
      plugins: [
        {
          name: 'hello-world-plugin'
        }
      ]
    })
    expect(pm.getPreset()).toStrictEqual({
      plugins: [
        {
          name: 'hello-world-plugin'
        }
      ]
    })
  })

  test('正确获取应该在构建阶段删除的 plugins', () => {
    const pm = new PresetManager(fsHelper.path)
    pm.initPresetByObject({
      plugins: [
        {
          name: 'plugin-1',
          removeAfterConstruction: true
        },
        {
          name: 'plugin-2',
          removeAfterConstruction: null
        },
        {
          name: 'plugin-3',
          removeAfterConstruction: false
        }
      ]
    })
    expect(pm.getPluginNamesShouldRemove()).toStrictEqual([
      'plugin-1'
    ])
  })

  test('执行函数形式的 preset, 异步环境下', async () => {
    const pm = new PresetManager(fsHelper.path)
    await pm.initPresetByUrl('http://mock_preset_async_fn')
    expect(pm.getPreset()).toStrictEqual({
      'initialDir': true,
      'initialDirDefaultName': 'hello-serendipity',
      'plugins': [
        {
          'name': 'bar-plugin'
        }
      ]
    })
  })

  test('通过网络请求来获取 preset', async () => {
    const pm = new PresetManager(fsHelper.path)
    await pm.initPresetByUrl('http://mock_preset')
    expect(pm.getPreset()).toStrictEqual({
      'initialDir': true,
      'initialDirDefaultName': 'hello-serendipity',
      'plugins': [
        {
          'name': '@attachments/serendipity-plugin-react'
        },
        {
          'name': '@attachments/serendipity-plugin-babel'
        }
      ]
    })
  })


  test('preset plugins 不存在时尝试获取构建阶段删除的 plugins', () => {
    const pm = new PresetManager(fsHelper.path)
    expect(pm.getPluginNamesShouldRemove()).toStrictEqual([])
  })

  test('当 preset 传入的不是一个本地路径，也不是一个 http URL 我们会从 GitHub 仓库的默认 preset 获取', async () => {
    const pm = new PresetManager(fsHelper.path)
    await pm.initPresetByUrl('react')
    expect(pm.getPreset()).toStrictEqual({
      'initialDir': true,
      'initialDirDefaultName': 'hello-serendipity',
      'plugins': [
        {
          'name': '@attachments/foo'
        },
        {
          'name': '@attachments/bar'
        }
      ]
    })
  })
})

