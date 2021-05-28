import { runCommand } from '../src'
const mockedExeca = require('../../../__mocks__/execa')

describe('test run command', () => {
  test('common usage', async () => {
    await runCommand('yarn add')
    expect(mockedExeca.getCommands()).toStrictEqual(['yarn add'])
  })
})
