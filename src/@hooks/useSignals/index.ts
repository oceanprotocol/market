import { SignalOriginItem } from '@context/Signals/_types'
import { useEffect, useState } from 'react'
import { useMockFetch } from '../useFetch'
import { nftSignalItems } from '@hooks/useSignals/_constants'

// Reusable state logic for loading signal data to the home page
// A hook to fetch signals for all available assets
export default function useSignalOrigin(baseUrl: string) {
  // TODO initialize the baseUrl for a new signal
  // TODO initialize the query for the said signal
  // TODO initialize the urql client for all the signals
  // TODO adapt the data from all signals with either enabled or disabled
  const [signalOriginsList, setSignalsOriginsList] = useState([])
  // Note we're using a mock fetch API for now
  const { loading, get } = useMockFetch(baseUrl, true, 6000, [
    {
      type: 'asset',
      title: 'Rug pull signal',
      origin: baseUrl,
      signals: nftSignalItems
    }
  ])
  /**
   * A method fetching signals from specified origin URL
   * @returns SignalOriginItem[]
   * @memberOf useSignalOrigin
   * */
  function fetchSignals(url: string) {
    return get(url)
      .then((data: SignalOriginItem[]) => {
        setSignalsOriginsList([...data])
        console.log(data)
      })
      .catch((err) => console.error(err))
  }

  useEffect(() => {
    ;(async () => {
      await fetchSignals('')
    })()
  }, [])
  return {
    signalOriginsList,
    fetchSignals,
    loading
  }
}
