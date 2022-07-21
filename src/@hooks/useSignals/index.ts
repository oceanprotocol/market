import { AssetSignalItem, SignalOriginItem } from '@context/Signals/_types'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher, onError, onSuccess } from '@hooks/useSignals/_util'
// Reusable state logic for loading signal data to the home page
// A hook to fetch signals for all available assets
export default function useSignalsLoader(origin: string | string[]) {
  // TODO adapt the data from all signals with either enabled or disabled
  const [signalItems, setSignalItems] = useState<AssetSignalItem[]>([])
  const [signalOriginsList, setSignalsOriginsList] = useState<
    SignalOriginItem[]
  >([])
  const [assetIds, setAssetIds] = useState<string[]>([])
  const [publisherIds, setPublisherIds] = useState<string[]>([])
  const [userAddresses, setUserAddresses] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  console.log(origin)
  /**
   * setSignalSettings
   * A method fetching signals from specified origin URL
   * @returns SignalOoptionsriginItem[]
   * @memberOf useSignalsLoader
   * */
  console.log('fetchSignalData', origin)
  const { data, error, isValidating } = useSWR(
    origin[0].length > 0 ? origin : null,
    fetcher,
    {
      refreshInterval: 120000,
      onSuccess,
      onError
    }
  )
  useEffect(() => {
    setLoading((!data && !error) || isValidating)
    if (data) {
      console.log('Signal data available', data)
      setSignalItems([...data])
    }
    console.log(loading)
  }, [data, error, isValidating, loading])
  return {
    signalItems,
    assetIds,
    setAssetIds,
    signalOriginsList,
    publisherIds,
    userAddresses,
    loading
  }
}
