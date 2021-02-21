import * as process from 'process'
import * as path from 'path'
import * as fs from 'fs'
import logger from '@attachments/serendipity-public/bin/utils/logger'
import CoreManager from '../src/coreManager'

const mockedExeca = require('../../../__mocks__/execa')

describe('cli Manager 模块测试', () => {
  beforeEach(() => {
    process.env.SERENDIPITY_CONFIG = 'DEVELOPMENT'
  })


  test('重复创建工程 应该提示用户该目录已经存在', async () => {
    jest.mock('fs')
    jest.mock('inquirer')
    jest.mock('execa')

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
    jest.mock('fs')
    jest.mock('inquirer')
    jest.mock('execa')

    const coreManager = new CoreManager([], '/')
    coreManager.create('foo-project', {
      git: false,
      commit: '',
      preset: 'hello world~'
    })
    expect(fs.existsSync('/foo-project'))
  })

  test('git 初始化测试', async () => {
    jest.mock('execa')
    const playgroundPath = path.resolve(process.cwd(), 'playground/hello')
    const cm = new CoreManager([], playgroundPath)
    await cm.create('hello', {
      preset: 'D:\\projects\\serendipity\\examples\\presets\\reactApp.js'
    })
    console.log(mockedExeca.getCommands())
  })
})