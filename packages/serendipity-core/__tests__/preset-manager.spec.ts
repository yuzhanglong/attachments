/*
 * File: presetManager.spec.ts
 * Description: preset 单元测试
 * Created: 2021-3-2 13:27:19
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { fsMock, PRESET_CDN_BASE_URL } from '@attachments/serendipity-public'
import { PresetManager } from '../src'

describe('preset Manager 模块测试', () => {
  const mock = new MockAdapter(axios)

  test('通过 preset 对象来初始化 presetManager', async () => {
    const pm = await PresetManager.createPresetManagerByObject({
      plugins: [
        {
          name: 'hello-world-plugin'
        }
      ]
    })
    expect(pm.getPreset()).toStrictEqual({
      'initialDir': true,
      'initialDirDefaultName': 'my-project',
      'plugins': [
        {
          'name': 'hello-world-plugin'
        }
      ]
    })
  })

  test('通过远程路径初始化 presetManager', async () => {
    const f = fsMock({})
    mock.onGet('https://mock_preset').reply(200, 'const path = require(\'path\')\n' +
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

    const pm = await PresetManager.createPresetManagerByRemotePath(f.path, 'https://mock_preset')
    expect(pm.getPreset()).toStrictEqual({
      'initialDir': true,
      'initialDirDefaultName': 'my-project',
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

  test('传入不合法的远程 url', async () => {
    try {
      // @ts-ignore
      await PresetManager.createPresetManagerByRemotePath(666, 666)
    } catch (e) {
      expect(e.message).toStrictEqual('target.startsWith is not a function')
    }

    try {
      // @ts-ignore
      await PresetManager.createPresetManagerByRemotePath(666, 'foo')
    } catch (e) {
      expect(e.message).toStrictEqual('不合法的 preset 路径!')
    }
  })

  test('通过本地路径初始化 presetManager', async () => {
    const f = fsMock({
      'foo-preset.js': 'const path = require(\'path\')\n' +
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
        '}'
    })

    const pm = await PresetManager.createPresetManager(f.resolve('foo-preset.js'))
    expect(pm.getPreset()).toStrictEqual({
      'initialDir': true,
      'initialDirDefaultName': 'my-project',
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

  test('传入不合法的本地 preset 路径', async () => {
    try {
      await PresetManager.createPresetManagerByLocalPath('666')
    } catch (e) {
      expect(e.message).toStrictEqual('不合法的本地 preset 路径！')
    }
  })

  test('正确获取应该在构建阶段删除的 plugins', async () => {
    const pm = await PresetManager.createPresetManagerByObject({
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

  test('在异步环境下执行函数形式的 preset，执行之，并将其返回值作为 preset 结果', async () => {
    mock.onGet('https://mock_preset_async_fn').reply(200, 'const axios = require("axios")\n' +
      'module.exports = async () => {\n' +
      '      const isFooPlugin = false\n' +
      '      return {\n' +
      '        plugins: [\n' +
      '          {\n' +
      '            name: isFooPlugin ? \'foo-plugin\' : \'bar-plugin\'\n' +
      '          }\n' +
      '        ]\n' +
      '      }\n' +
      '    }')

    const f = fsMock({})
    const pm = await PresetManager.createPresetManager('https://mock_preset_async_fn', f.path)

    expect(pm.getPreset()).toStrictEqual({
      'initialDir': true,
      'initialDirDefaultName': 'my-project',
      'plugins': [
        {
          'name': 'bar-plugin'
        }
      ]
    })
  })

  test('当 preset 传入的不是一个本地路径，我们要求用户传入回调函数来获取', async () => {
    const f = fsMock({})
    mock.onGet(`${PRESET_CDN_BASE_URL}/react.js`).reply(200, 'const path = require(\'path\')\n' +
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

    const pm = await PresetManager.createPresetManager('react', f.path, async (target) => {
      return await PresetManager.createPresetManagerByRemotePath(f.path, `${PRESET_CDN_BASE_URL}/${target}.js`)
    })

    expect(pm.getPreset()).toStrictEqual({
      'initialDir': true,
      'initialDirDefaultName': 'my-project',
      'plugins': [
        {
          'name': '@attachments/foo'
        },
        {
          'name': '@attachments/bar'
        }
      ]
    })
    f.clear()
  })

  test('当 preset 传入的不是一个本地路径，且用户没有传入回调函数，我们会抛出一个异常', async () => {
    const f = fsMock({})

    try {
      await PresetManager.createPresetManager('react', f.path)
    } catch (e) {
      expect(e.message).toStrictEqual('you should pass callback for not-remote-path and not-local-path preset!')
    }
  })
})
