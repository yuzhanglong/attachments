import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { create } from '../src/create'

describe('测试 create API', () => {
  const mock = new MockAdapter(axios)

  test('初始化 create API', () => {
    mock.onGet('https://preset_init_dir').reply(
      200,
      'module.exports = {\n' +
      '    plugins: [],\n' +
      '    initialDir: true,\n' +
      '    initialDirDefaultName: \'be-happy\'\n' +
      '  }'
    )
    const c = create({
      name: 'foo',
      gitMessage: 'hello world!',
      initGit: false,
      presetPath: 'https://preset_init_dir'
    })
  })
})
