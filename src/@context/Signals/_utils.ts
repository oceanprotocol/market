import useSWR from 'swr'
import { SignalParams } from '@context/Signals/_types'
import { fetchData } from '@utils/fetch'

export interface SWROptions {
  urlKey: any
  config: any
  signalParams: SignalParams
}
export default function useSignalOriginFetch(options: SWROptions) {
  useSWR(
    () =>
      options.signalParams.assetId
        ? `${options.urlKey}?assetIds=${options.signalParams.assetId}`
        : null,
    fetchData,
    {
      ...options.config
    }
  )
}
