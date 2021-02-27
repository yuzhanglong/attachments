/*
 * File: coreManager.spec.ts
 * Description: coreManager 单元测试
 * Created: 2021-2-22 13:13:40
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as process from 'process'
import * as path from 'path'
import * as fs from 'fs'
import { logger } from '@attachments/serendipity-public/bin'
import { playgroundTestPath } from '@attachments/serendipity-public/bin/utils/paths'
import { initTestDir } from '@attachments/serendipity-public/bin/utils/testUtils'
import CoreManager from '../src/coreManager'

jest.mock('inquirer')
jest.mock('execa')

describe('cli Manager 模块测试', () => {
  beforeEach(() => {
    initTestDir()

    process.env.SERENDIPITY_CONFIG = 'DEVELOPMENT'

    const exitMock = jest.fn()

    const realProcess = process
    global.process = {
      ...realProcess,
      exit: exitMock as never
    }
  })


  test('重复创建工程 应该提示用户该目录已经存在', async () => {
    logger.error = jest.fn()
    const target = path.resolve(playgroundTestPath, 'foo')
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target)
    }

    const manager = new CoreManager([], target)
    manager.initWorkDir()
    expect(logger.error).toBeCalledWith('该目录已经存在，请删除旧目录或者在其他目录下执行创建命令！')
  })

  test('coreManager 流程测试', async () => {
    const coreManager = new CoreManager([], playgroundTestPath)
    await coreManager.create('foo-project', {
      git: false,
      commit: '',
      preset: ''
    })
    expect(fs.existsSync(path.resolve(playgroundTestPath, 'foo-project')))
  })

  test('用户没有传入 preset', async () => {
    logger.error = jest.fn()
    const cm = new CoreManager([], playgroundTestPath)
    await cm.create('hello', {
      preset: '',
      git: true,
      commit: 'feat: initial commit'
    })
    expect(logger.error).toBeCalledWith('传入的选项有误：preset 为空，请选择一个正确的 preset，可以是一个本地路径或者 http url')
  })

  test('add 命令下用户输入不合法的 plugin 名称', async () => {
    logger.error = jest.fn()
    const cm = new CoreManager([], path.resolve(playgroundTestPath))
    await cm.add('bad-name', {
      version: '1.0.0'
    })
    expect(logger.error).toBeCalledWith('bad-name 不是一个合法的插件名称，名称应该以 serendipity-plugin 或者 @attachments/serendipity-plugin 开头')
  })
})
