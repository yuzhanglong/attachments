/*
 * File: coreManager.spec.ts
 * Description: coreManager 单元测试
 * Created: 2021-2-22 13:13:40
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as process from 'process'
import * as fs from 'fs'
import * as path from 'path'
import { logger } from '@attachments/serendipity-public'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { CoreManager } from '../src/core-manager'

jest.mock('inquirer')
jest.mock('execa')

// eslint-disable-next-line max-lines-per-function
describe('cli Manager 模块测试', () => {
  const mock = new MockAdapter(axios)

  mock.onGet('https://preset_init_dir').reply(
    200,
    'module.exports = {\n' +
    '    plugins: [],\n' +
    '    initialDir: true,\n' +
    '    initialDirDefaultName: \'be-happy\'\n' +
    '  }'
  )
  mock.onGet('https://preset_init_dir_no_default_name').reply(
    200,
    'module.exports = {\n' +
    '    plugins: [],\n' +
    '    initialDir: true,\n' +
    '  }'
  )
  mock.onGet('https://preset_no_init_dir').reply(
    200,
    'module.exports = {\n' +
    '    plugins: [],\n' +
    '    initialDir: false,\n' +
    '  }'
  )

  beforeEach(() => {
    process.env.SERENDIPITY_CONFIG = 'DEVELOPMENT'
    const exitMock = jest.fn()
    const realProcess = process
    global.process = {
      ...realProcess,
      exit: exitMock as never
    }
  })

  afterAll(() => {
    fsHelper.removeDir()
  })

  test('用户在已存在的目录中尝试重新创建工程, 允许创建', async () => {
    logger.error = jest.fn()
    const base = fsHelper.resolve('hello')
    if (!fs.existsSync(base)) {
      fs.mkdirSync(base)
    }

    const manager = new CoreManager(fsHelper.path)


    manager.initWorkDir('hello', {
      plugins: []
    })

    expect(logger.error).toBeCalledTimes(0)
  })

  test('用户没有传入 preset', async () => {
    logger.error = jest.fn()
    const cm = new CoreManager(fsHelper.path)
    await cm.create('react', {
      preset: '',
      git: true,
      commit: 'feat: initial commit'
    })
    expect(logger.error).toBeCalledWith('不合法的 preset, preset 的值为一个本地路径或者 url 字符串')
  })

  test('add 命令下用户输入不合法的 plugin 名称', async () => {
    logger.error = jest.fn()
    const cm = new CoreManager(fsHelper.path)

    cm.getCoreManagerHooks().onAddValidateError.tap('onAddValidateError', ({ name }) => {
      logger.error(`${name} 不是一个合法的插件名称，名称应该以 serendipity-plugin 或者 @attachments/serendipity-plugin 开头`)
    })

    await cm.add('bad-name', {
      version: '1.0.0'
    })
    expect(logger.error).toBeCalledWith('bad-name 不是一个合法的插件名称，名称应该以 serendipity-plugin 或者 @attachments/serendipity-plugin 开头')
  })

  test('在 preset 配置了初始化工作目录，用户没有指定 create 后的参数，我们使用 preset 提供的默认值', async () => {
    const cm = new CoreManager(fsHelper.path)
    logger.info = jest.fn()
    await cm.create('', {
      preset: 'https://preset_init_dir'
    })
    expect(logger.info).toBeCalledWith('preset 要求工作目录不得为空，你没有传入工作目录名称，将以默认值 be-happy 替代\n')
    expect(fs.existsSync(path.resolve(fsHelper.path, 'be-happy'))).toBeTruthy()
  })

  test('在 preset 配置了初始化工作目录，用户和 preset 没有指定 create 后的参数，我们使用 preset 提供的默认值', async () => {
    const cm = new CoreManager(fsHelper.path)
    logger.info = jest.fn()
    await cm.create('', {
      preset: 'https://preset_init_dir_no_default_name'
    })
    expect(logger.info).toBeCalledWith('preset 要求工作目录不得为空，你没有传入工作目录名称，将以默认值 hello-serendipity 替代\n')
    expect(fs.existsSync(path.resolve(fsHelper.path, 'hello-serendipity'))).toBeTruthy()
  })

  test('preset 没有配置初始化目录，用户传入空白名称，则工作目录为 process.cwd()', async () => {
    const cm = new CoreManager(fsHelper.path)
    logger.info = jest.fn()
    await cm.create('', {
      preset: 'https://preset_no_init_dir'
    })
    expect(cm.getBasePath()).toStrictEqual(fsHelper.path)
  })

  test('用户传入了 --delete 参数, 删除之', async () => {
    const cm = new CoreManager(fsHelper.path)
    await cm.add('foo', {
      delete: true
    })
    expect(cm.getBasePath()).toStrictEqual(fsHelper.path)
  })
})
