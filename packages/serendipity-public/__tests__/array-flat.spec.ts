import { arrayFlat } from '../src'

describe('array-flat test', () => {
  test('array flat', () => {
    expect(arrayFlat([1, 2, 3])).toStrictEqual([1, 2, 3])
    expect(arrayFlat([1, [2, 3, 4], 3])).toStrictEqual([1, 2, 3, 4, 3])
    expect(arrayFlat([1, 2, 3])).toStrictEqual([1, 2, 3])
  })

  test('negative depth', () => {
    expect(arrayFlat([1, 2, 3], -1)).toStrictEqual([1, 2, 3])
  })
})
