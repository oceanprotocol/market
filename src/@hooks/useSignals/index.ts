import { SignalOriginItem } from '@context/Signals/_types'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import {
  fetcher,
  getURLParams,
  onError,
  onSuccess
} from '@hooks/useSignals/_util'
import { UseSignals } from '@hooks/useSignals/_types'
// Reusable state and fetch logic for loading signal data to any page, context or component
// A hook to fetch signals for all available in a particular signal type list e.g asset list or publisher list
export default function useSignalsLoader(
  origin: string | string[],
  refreshInterval = 120000
): UseSignals {
  const [signalItems, setSignalItems] = useState<SignalOriginItem[]>([])
  const [assetIds, setAssetIds] = useState<string[]>([])
  const [publisherIds, setPublisherIds] = useState<string[]>([])
  const [userAddresses, setUserAddresses] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  let urlKey = null
  if (origin) {
    if (origin[0] && origin[0].length > 0) {
      urlKey = origin
    }
  }
  const { data, error, isValidating } = useSWR(urlKey, fetcher, {
    refreshInterval,
    revalidateOnFocus: false,
    onSuccess,
    onError
  })
  useEffect(() => {
    setLoading((!data && !error) || isValidating)
    if (data) {
      setSignalItems([...data])
    }
  }, [data, error, isValidating, loading])
  return {
    signalItems,
    assetIds,
    setAssetIds,
    publisherIds,
    userAddresses,
    setPublisherIds,
    setUserAddresses,
    loading
  }
}

export function useAssetListSignals(
  dataTokenAddresses: string[][],
  signals: SignalOriginItem[],
  assetSignalsUrls: string[],
  signalViewType = 'listView'
) {
  const [assetSignalOrigins, setAssetSignalOrigins] = useState<any[]>([])
  const [datatokensStringsArray, setDatatokensStringsArray] = useState([])
  const [urls, setUrls] = useState<any[]>()

  useEffect(() => {
    if (dataTokenAddresses && dataTokenAddresses.length > 0) {
      // Get only those asset signals that are for the list view and for asset types only
      setAssetSignalOrigins(
        signals
          .filter((signal) => signal.type === 1)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .filter((signal) => signal[signalViewType].value)
      )
      setDatatokensStringsArray(
        dataTokenAddresses.map((datatokensList) => {
          if (datatokensList.length > 1) datatokensList.join(',')
          return datatokensList[0]
        })
      )
      console.log('datatokensStringsArray')
      console.log(dataTokenAddresses)
      setUrls(
        assetSignalsUrls.map((item) => {
          console.log(
            item + getURLParams(['assetId', datatokensStringsArray.join(',')])
          )
          return (
            item + getURLParams(['assetId', datatokensStringsArray.join(',')])
          )
        })
      )
    }
  }, [signals, dataTokenAddresses])
  return { urls, assetSignalOrigins }
}
