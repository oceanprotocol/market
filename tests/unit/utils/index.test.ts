import axios, { AxiosResponse } from 'axios'
import { mocked } from 'ts-jest/dist/util/testing'

import {
  toStringNoMS,
  updateQueryStringParameter,
  isDid,
  getFileInfo,
  JSONparse,
  priceQueryParamToWei,
  setProperty
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

describe('getFileInfo()', () => {
  it('Success on existing file', async () => {
    mocked(axios).mockResolvedValue({
      data: {
        status: 200,
        result: { contentLength: '10000', contentType: 'application/pdf' }
      }
    } as AxiosResponse)

    const fileInfo = await getFileInfo('https://demo.com')
    expect(fileInfo.contentType).toBe('application/pdf')
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

describe('JSONparse()', () => {
  it('parse valid JSON and returns it', () => {
    expect(
      JSONparse<{ [key: string]: boolean }>('{"valid":true}', 'should not fail')
    ).toEqual({
      valid: true
    })
  })

  it('returns undefined when invalid JSON test is passed', () => {
    expect(
      JSONparse<unknown>(
        'hello',
        'Console.error part of test: JSONparse should fail'
      )
    ).toBe(undefined)
  })

  it('returns undefined when receives undefined', () => {
    expect(JSONparse<unknown>(undefined, 'Should not be logged')).toBe(
      undefined
    )
  })
})

describe('priceQueryParamToWei()', () => {
  it('converts a valid (eth) string amount and returns it', () => {
    expect(priceQueryParamToWei('12')).toEqual('12000000000000000000')
  })

  it('returns undefined when (eth) string amount is passed', () => {
    expect(priceQueryParamToWei('12.12.12')).toEqual(undefined)
  })

  it('returns undefined when (eth) string amount is undefined', () => {
    expect(priceQueryParamToWei(undefined)).toEqual(undefined)
  })
})

describe('setProperty()', () => {
  let testObject: { foo: string }

  beforeEach(() => {
    testObject = {
      foo: 'bar'
    }
  })

  it('changes the value of a property in an object', () => {
    setProperty(testObject, 'foo', 'wunderbar')
    expect(testObject.foo).toEqual('wunderbar')
  })

  it('removes a property from an object if a falsy value is passed', () => {
    setProperty(testObject, 'foo')
    expect(testObject.foo).toBeUndefined()
  })
})
