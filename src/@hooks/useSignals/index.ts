import { SignalItem, SignalOriginItem } from '@context/Signals/_types'
import { useState } from 'react'
import { fetchData } from '@utils/fetch'

// Reusable state logic for loading signal data to the home page
// A hook to fetch signals for all available assets
export default function useSignalsLoader(baseUrl: string) {
  // TODO adapt the data from all signals with either enabled or disabled

  const [originUrl, setOriginUrl] = useState('api/rugs/v1/sample-signals')
  const [signalItems, setSignalItems] = useState<SignalItem[]>([])
  const [signalOriginsList, setSignalsOriginsList] = useState<
    SignalOriginItem[]
  >([])
  const [assetIds, setAssetIds] = useState<string[]>([])
  const [publisherIds, setPublisherIds] = useState<string[]>([])
  const [userAddresses, setUserAddresses] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  /**
   * A method fetching signals from specified origin URL
   * @returns SignalOriginItem[]
   * @memberOf useSignalsLoader
   * */
  async function fetchSignals(url: string): Promise<SignalItem[]> {
    console.log(baseUrl + url)
    try {
      return await fetchData(baseUrl + url)
    } catch (error) {
      console.log(error)
    }
  }

  return {
    originUrl,
    setOriginUrl,
    signalItems,
    setSignalItems,
    assetIds,
    setAssetIds,
    signalOriginsList,
    setSignalsOriginsList,
    publisherIds,
    setPublisherIds,
    userAddresses,
    setUserAddresses,
    fetchSignals,
    loading,
    setLoading
  }
}
