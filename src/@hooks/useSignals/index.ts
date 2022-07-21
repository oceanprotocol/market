import { AssetSignalItem } from '@context/Signals/_types'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher, onError, onSuccess } from '@hooks/useSignals/_util'
// Reusable state and fetch logic for loading signal data to any page, context or component
// A hook to fetch signals for all available in a particular signal type list e.g asset list or publisher list
export default function useSignalsLoader(origin: string | string[]) {
  const [signalItems, setSignalItems] = useState<AssetSignalItem[]>([])
  const [assetIds, setAssetIds] = useState<string[]>([])
  const [publisherIds, setPublisherIds] = useState<string[]>([])
  const [userAddresses, setUserAddresses] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  console.log('fetchSignalData', origin)
  const { data, error, isValidating } = useSWR(
    origin[0].length > 0 ? origin : null,
    fetcher,
    {
      refreshInterval: 12000,
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
    publisherIds,
    userAddresses,
    loading
  }
}
