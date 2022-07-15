import {
  SignalItem,
  SignalOriginItem,
  SignalParams
} from '@context/Signals/_types'
import { fetchAllData, fetchData } from '@utils/fetch'

export function getURLParams(urlParams: SignalParams) {
  let paramString = ''
  if (urlParams.assetIds.length > 0) {
    paramString = `?assetId=${urlParams.assetIds.join(',')}`
  }
  if (urlParams.publisherIds.length > 0) {
    paramString += `publisherId=${urlParams.publisherIds.join(',')}`
  }
  if (urlParams.userAddresses.length > 0) {
    paramString += `userAccountId=${urlParams.userAddresses.join(',')}`
  }
  return paramString
}
export function getSignalUrls(signalOriginItem: SignalOriginItem) {
  return signalOriginItem.origin + getURLParams(signalOriginItem.urlParams)
}

/**
 * A method fetching signals from specified origin URL
 * @returns SignalOriginItem[]
 * @memberOf useSignalsLoader
 * */
export async function fetchSignals(url: string): Promise<SignalItem[]> {
  try {
    return await fetchData(url)
  } catch (error) {
    console.log(error)
  }
}
export async function fetchMultipleSignals(urls: string[]): Promise<any[]> {
  console.log(urls)
  try {
    console.log('isUrlArray', urls)
    if (urls.length > 0 && Array.isArray(urls)) {
      return await fetchAllData(urls)
    }
  } catch (error) {
    console.log(error)
  }
}

export async function onSuccess(data: SignalItem[]) {
  if (!data) return
  console.log('[signals] Got new signal data.', data)
  return data
}
export async function onError(error: any) {
  console.error('[signals] loading error.', error)
}

export function arrayEqual(a1: any[], a2: any[]) {
  if (a1.length !== a2.length) return false
  for (let i = 0; i < a1.length; i++) {
    if (a1[i] !== a2[i]) {
      return false
    }
  }
  return true
}
