import * as process from 'process'
import * as path from 'path'
import * as fs from 'fs'
import logger from '@attachments/serendipity-public/bin/utils/logger'
import CoreManager from '../src/coreManager'

describe('cli Manager 模块测试', () => {
  beforeEach(() => {
    process.env.SERENDIPITY_CONFIG = 'DEVELOPMENT'
  })


  test('重复创建工程 应该提示用户该目录已经存在', () => {
    logger.error = jest.fn()
    const target = path.resolve(process.cwd(), 'playground/duplicate_project')
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target)
    }
    const manager = new CoreManager([], target)
    manager.initWorkDir()
    expect(logger.error).toBeCalledWith('该目录已经存在，请删除旧目录或者在其他目录下执行创建命令！')
  })


  test('service 包不存在 提示用户并准备退出程序', () => {
    console.log = jest.fn()
    logger.error = jest.fn()
    const manager = new CoreManager([])
    manager.create('foo', {
      type: 'NOT_EXIST_TYPE'
    })
    expect(logger.error).toBeCalledWith('获取 service 包失败，请检查相应的 service 模块是否存在！')
  })

  test('用户传参验证(基本命令，不包括 service 层)', () => {
    const validation1 = CoreManager.validateCreateCommand({
      type: 'react'
    })
    expect(validation1.validated).toBeTruthy()
    expect(validation1.message).toBeNull()


    const validation2 = CoreManager.validateCreateCommand({
      type: undefined
    })
    expect(validation2.validated).toBeFalsy()
    expect(validation2.message).toStrictEqual('类型为空，请选择一个正确的项目类型，例如 \'react\'')
  })
})