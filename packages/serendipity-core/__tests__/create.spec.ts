import * as fs from 'fs'
import * as path from 'path'
import { fsMock } from '@attachments/serendipity-public'
import { useSerendipityCreate } from '../src'

jest.unmock('execa')


describe('测试 create API', () => {
  const helloPreset = path.resolve(process.cwd(), 'examples', 'test-cases', 'preset-cases', 'hello-world.js')

  test('create API 正常初始化，临时预设文件被创建到项目的根目录下', async () => {
    const f = fsMock({})

    const c = await useSerendipityCreate({
      name: 'foo',
      gitMessage: 'hello world!',
      initGit: false,
      presetPath: helloPreset,
      workingDir: f.path
    })

    expect(c.coreHooks).toBeDefined()
    expect(typeof c.execute).toStrictEqual('function')
    expect(c.presetManager).toBeDefined()
    expect(c.workingDir).toBeDefined()

    expect(fs.existsSync(f.resolve('foo'))).toBeTruthy()

    await c.execute()

    expect(fs.existsSync(f.resolve('foo', 'package.json'))).toBeTruthy()
  })

  test('如果目标路径已经存在，我们不会再其下创建一个项目，而是抛出异常', async () => {
    const f = fsMock({
      foo: {
        'a.out': 'aaa'
      }
    })

    try {
      const c = await useSerendipityCreate({
        name: 'foo',
        initGit: false,
        presetPath: helloPreset,
        workingDir: f.path
      })

      await c.execute()
    } catch (e) {
      expect(e.message).toStrictEqual('The working directory already exists!')
    }
  })

  test('测试 construction 模式，质询、构建阶段应该被正常执行', async () => {
    const f = fsMock({})

    const c = await useSerendipityCreate({
      name: 'foo',
      initGit: false,
      presetPath: helloPreset,
      workingDir: f.path
    })

    expect(fs.existsSync(f.resolve('foo'))).toBeTruthy()

    await c.execute()

    expect(fs.existsSync(f.resolve('foo', 'package.json'))).toBeTruthy()

    // template 写入
    expect(fs.existsSync(f.resolve('foo', 'foo.js'))).toBeTruthy()
    expect(fs.existsSync(f.resolve('foo', 'bar.js'))).toBeTruthy()
  }, 100000)
})
