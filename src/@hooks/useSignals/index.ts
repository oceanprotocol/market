import { AssetSignalItem } from '@context/Signals/_types'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher, onError, onSuccess } from '@hooks/useSignals/_util'
import { UseSignals } from '@hooks/useSignals/_types'
// Reusable state and fetch logic for loading signal data to any page, context or component
// A hook to fetch signals for all available in a particular signal type list e.g asset list or publisher list
export default function useSignalsLoader(
  origin: string | string[],
  refreshInterval = 120000
): UseSignals {
  const [signalItems, setSignalItems] = useState<AssetSignalItem[]>([])
  const [assetIds, setAssetIds] = useState<string[]>([])
  const [publisherIds, setPublisherIds] = useState<string[]>([])
  const [userAddresses, setUserAddresses] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { data, error, isValidating } = useSWR(
    origin[0].length > 0 ? origin : null,
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: false,
      onSuccess,
      onError
    }
  )
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
