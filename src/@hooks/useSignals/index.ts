import { SignalOriginItem } from '@context/Signals/_types'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import {
  fetcher,
  getURLParamsAssets,
  onError,
  onSuccess
} from '@hooks/useSignals/_util'
import { UseSignals } from '@hooks/useSignals/_types'
import { useWeb3 } from '@context/Web3'
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

  const urlKey = useMemo(() => {
    if (origin && Array.isArray(origin)) {
      return origin?.filter((url: string) => url)
    }
    return null
  }, [origin])

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

export function useListSignals(
  datatokenAddresses: string[],
  signals: SignalOriginItem[],
  assetSignalsUrls: string[],
  signalViewType = 'listView',
  onlyAssetSignals = false
) {
  const [assetSignalOrigins, setAssetSignalOrigins] = useState<any[]>([])
  const [datatokensStringsArray, setDatatokensStringsArray] = useState([])
  const [urls, setUrls] = useState<any[]>([])
  const { accountId } = useWeb3()
  useEffect(() => {
    if (datatokenAddresses && datatokenAddresses.length > 0) {
      // Get only those asset signals that are for the list view and for asset types only
      setAssetSignalOrigins(
        signals
          .filter((signal) => (onlyAssetSignals ? signal.type === 1 : true))
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .filter((signal) => signal[signalViewType].value)
      )
      const newDatatokenString = datatokenAddresses.join(',')
      setDatatokensStringsArray([newDatatokenString])
      setUrls(
        assetSignalsUrls.map((item) => {
          return getURLParamsAssets({
            uuids: [
              { label: '$assetId', value: datatokensStringsArray.join(',') },
              { label: '$userAccount', value: accountId || '' }
            ],
            origin: item
          })
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signals, datatokenAddresses, assetSignalsUrls, signalViewType, accountId])
  return { urls, assetSignalOrigins }
}
