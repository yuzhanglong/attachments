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
import CoreManager from '../src/coreManager'

jest.mock('fs')
jest.mock('inquirer')
jest.mock('execa')

describe('cli Manager 模块测试', () => {
  beforeEach(() => {
    process.env.SERENDIPITY_CONFIG = 'DEVELOPMENT'
  })


  test('重复创建工程 应该提示用户该目录已经存在', async () => {
    logger.error = jest.fn()
    const target = path.resolve('/foo')
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target)
    }

    const manager = new CoreManager([], target)
    manager.initWorkDir()
    expect(logger.error).toBeCalledWith('该目录已经存在，请删除旧目录或者在其他目录下执行创建命令！')
  })

  test('coreManager 流程测试', async () => {
    const coreManager = new CoreManager([], '/')
    await coreManager.create('foo-project', {
      git: false,
      commit: '',
      preset: ''
    })
    expect(fs.existsSync('/foo-project'))
  })

  test('用户没有传入 preset', async () => {
    logger.error = jest.fn()
    const cm = new CoreManager([], '/hello')
    await cm.create('hello', {
      preset: '',
      git: true,
      commit: 'feat: initial commit'
    })
    expect(logger.error).toBeCalledWith('传入的选项有误：preset 为空，请选择一个正确的 preset，可以是一个本地路径或者 http url')
  })
})