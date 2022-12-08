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
import { NOT_LOGGED_IN } from '@utils/constants'
// Reusable state and fetch logic for loading signal data to any page, context or component
// A hook to fetch signals for all available in a particular signal type list e.g asset list or publisher list
export default function useSignalsLoader(
  origin: string | string[],
  refreshInterval = 120000
): UseSignals {
  const [signalItems, setSignalItems] = useState<SignalOriginItem[]>([])
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
    publisherIds,
    userAddresses,
    setPublisherIds,
    setUserAddresses,
    loading
  }
}

export function useSignalUrls(
  datatokenAddresses: string[],
  assetSignalsUrls: string[]
) {
  const { accountId } = useWeb3()

  const urls = useMemo(() => {
    if (!assetSignalsUrls?.length || !datatokenAddresses?.length) return []

    return assetSignalsUrls.map((item) => {
      return getURLParamsAssets({
        uuids: [
          {
            label: '$assetId',
            value: datatokenAddresses
              .map((datatoken) => datatoken.toString().toLowerCase())
              .join(',')
          },
          {
            label: '$user',
            value: accountId?.toString().toLowerCase() || NOT_LOGGED_IN
          }
        ],
        origin: item
      })
    })
  }, [accountId, assetSignalsUrls, datatokenAddresses])

  return urls
}

export function useListSignals(
  datatokenAddresses: string[],
  signals: SignalOriginItem[],
  assetSignalsUrls: string[],
  signalViewType = 'listView',
  onlyAssetSignals = false
) {
  const [assetSignalOrigins, setAssetSignalOrigins] = useState<any[]>([])

  const urls = useSignalUrls(datatokenAddresses, assetSignalsUrls)

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signals, datatokenAddresses, assetSignalsUrls, signalViewType])

  return { urls, assetSignalOrigins }
}
