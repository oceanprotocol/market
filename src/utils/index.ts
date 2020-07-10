import axios, { AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import { File } from '@oceanprotocol/squid'
import numeral from 'numeral'
import web3Utils from 'web3-utils'

export function updateQueryStringParameter(
  uri: string,
  key: string,
  newValue: string
): string {
  const regex = new RegExp('([?&])' + key + '=.*?(&|$)', 'i')
  const separator = uri.indexOf('?') !== -1 ? '&' : '?'

  if (uri.match(regex)) {
    return uri.replace(regex, '$1' + key + '=' + newValue + '$2')
  } else {
    return uri + separator + key + '=' + newValue
  }
}

export function prettySize(
  bytes: number,
  separator = ' ',
  postFix = ''
): string {
  if (bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      sizes.length - 1
    )
    return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)}${separator}${
      sizes[i]
    }${postFix}`
  }
  return 'n/a'
}

// Boolean value that will be true if we are inside a browser, false otherwise
export const isBrowser = typeof window !== 'undefined'

export function formatNumber(number: number, format?: string): string {
  numeral.zeroFormat('0')
  const defaultFormat = '0,0.000'

  return numeral(number).format(format || defaultFormat)
}

export function toStringNoMS(date: Date): string {
  return date.toISOString().replace(/\.[0-9]{3}Z/, 'Z')
}

export async function getFileInfo(url: string): Promise<File> {
  const response: AxiosResponse = await axios({
    method: 'POST',
    url: '/api/file',
    data: { url }
  })

  if (response.status > 299 || !response.data.result) {
    toast.error('Could not connect to File API')
    return
  }

  const { contentLength, contentType } = response.data.result

  return {
    contentLength,
    contentType: contentType || '', // need to do that cause squid.js File interface requires contentType
    url
  }
}

export function isDid(did: string | undefined): boolean {
  const didMatch = (did as string).match(/^did:op:([a-f0-9]{64})$/i)
  return !!didMatch
}

export function JSONparse<T>(
  input: string | undefined,
  errorMessage: string
): T | undefined {
  if (input === undefined) {
    return undefined
  }
  try {
    return JSON.parse(input) as T
  } catch (err) {
    console.error(errorMessage)
  }
}

export function priceQueryParamToWei(
  priceQueryParam: string | undefined,
  errorMessage?: string
): string | undefined {
  if (priceQueryParam === undefined) {
    return undefined
  }
  try {
    return web3Utils.toWei(priceQueryParam as string)
  } catch (err) {
    console.error(
      errorMessage || 'Error in priceQueryParamToWei',
      priceQueryParam
    )
  }
}

// The types of this function are deceivingly cryptic. This is just a helper
// that sets or removes a property on any object based on if the value passed is
// truthy or falsy
// e.g: setProperty({foo: 'bar'}, 'foo', false) -> {}
// setProperty({foo: 'bar'}, 'foo', 'baaz') -> { foo: 'baaz' }
export function setProperty<T extends Record<string, unknown>>(
  objectToBeUpdated: T,
  propertyName: keyof T,
  value?: T[keyof T]
) {
  if (value) {
    objectToBeUpdated[propertyName] = value
  } else {
    delete objectToBeUpdated[propertyName]
  }
}

export function formatBytes(a: number, b: number): string {
  if (a === 0) return '0 Bytes'
  const c = 1024
  const d = b || 2
  const e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const f = Math.floor(Math.log(a) / Math.log(c))
  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
}

export async function redeploy(): Promise<AxiosResponse | undefined> {
  try {
    const response = await axios.post('/api/redeploy')
    return response
  } catch (err) {
    console.error(err.message)
  }
}
