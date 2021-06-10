import * as path from 'path'
import { getPresetPathByName } from '../src/utils'

describe('工具函数测试', () => {
  test('test getPresetPathByName()', () => {
    const p = getPresetPathByName('react')
    const casePath = path.resolve(process.cwd(), 'packages', 'serendipity-core', 'presets', 'react.js')
    expect(p).toStrictEqual(casePath)
  })
})
