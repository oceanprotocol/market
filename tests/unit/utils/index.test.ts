import { toStringNoMS, updateQueryStringParameter } from '../../../src/utils'

describe('updateQueryStringParameter()', () => {
  it('transform a URI', () => {
    const newUri = updateQueryStringParameter(
      '/hello?param=hello',
      'param',
      'hello2'
    )
    expect(newUri).toContain('param=hello2')
  })
})

describe('toStringNoMS()', () => {
  it('returns a ISO string from a Date object without the milliseconds', () => {
    expect(toStringNoMS(new Date(1583956486719))).toEqual(
      '2020-03-11T19:54:46Z'
    )
  })
})
