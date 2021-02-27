/*
 * File: coreManager.spec.ts
 * Description: coreManager 单元测试
 * Created: 2021-2-22 13:13:40
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as process from 'process'
import * as fs from 'fs'
import { logger } from '@attachments/serendipity-public/bin'
import { generateTempPathInfo } from '@attachments/serendipity-public/bin/utils/testUtils'
import CoreManager from '../src/coreManager'

jest.mock('inquirer')
jest.mock('execa')

describe('cli Manager 模块测试', () => {
  const fsHelper = generateTempPathInfo()

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

  test('重复创建工程 应该提示用户该目录已经存在', async () => {
    logger.error = jest.fn()
    const base = fsHelper.resolve('hello')
    if (!fs.existsSync(base)) {
      fs.mkdirSync(base)
    }

    const manager = new CoreManager([], base)
    manager.initWorkDir()
    expect(logger.error).toBeCalledWith('该目录已经存在，请删除旧目录或者在其他目录下执行创建命令！')
  })

  test('用户没有传入 preset', async () => {
    logger.error = jest.fn()
    const cm = new CoreManager([], fsHelper.path)
    await cm.create('hello', {
      preset: '',
      git: true,
      commit: 'feat: initial commit'
    })
    expect(logger.error).toBeCalledWith('传入的选项有误：preset 为空，请选择一个正确的 preset，可以是一个本地路径或者 http url')
  })

  test('add 命令下用户输入不合法的 plugin 名称', async () => {
    logger.error = jest.fn()
    const cm = new CoreManager([], fsHelper.path)
    await cm.add('bad-name', {
      version: '1.0.0'
    })
    expect(logger.error).toBeCalledWith('bad-name 不是一个合法的插件名称，名称应该以 serendipity-plugin 或者 @attachments/serendipity-plugin 开头')
  })
})
