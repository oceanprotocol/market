import axios, { AxiosResponse } from 'axios'

import {
  toStringNoMS,
  updateQueryStringParameter,
  isDid
} from '../../../src/utils'

jest.mock('axios')

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

describe('isDid()', () => {
  it('checks correct DID', () => {
    expect(
      isDid(
        'did:op:bb6b9e960b2e40e3840ca5eafc8eb97af431b4d190b54e2f9926e1f792cdc54f'
      )
    ).toBe(true)
  })

  it('errors when no DID', () => {
    expect(isDid('hello')).toBe(false)
  })
})
