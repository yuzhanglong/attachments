import * as process from 'process'
import * as path from 'path'
import * as fs from 'fs'
import logger from '@attachments/serendipity-public/bin/utils/logger'
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

  test('coreManager 流程测试', () => {
    const coreManager = new CoreManager([], '/')
    coreManager.create('foo-project', {
      git: false,
      commit: '',
      preset: 'hello world~'
    })
    expect(fs.existsSync('/foo-project'))
  })
})