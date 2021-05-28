import { fileTreeWriting, isPlugin } from '../src'

describe('test files', () => {
  test('fileTreeWriting 传入错误的 fileMap 格式', () => {
    try {
      // @ts-ignore
      fileTreeWriting(666)
    } catch (e) {
      expect(e.message).toStrictEqual('fileMap 格式错误')
    }
  })

  test('test isPlugin', () => {
    expect(isPlugin('serendipity-plugin-react-bar')).toBeTruthy()
    expect(isPlugin('@attachments/serendipity-plugin-foo')).toBeTruthy()
  })
})
