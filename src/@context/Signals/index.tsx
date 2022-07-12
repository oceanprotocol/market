import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect
} from 'react'
import { SignalItem, SignalOriginItem } from '@context/Signals/_types'
import useSignalsLoader from '@hooks/useSignals'
import { LoggerInstance } from '@oceanprotocol/lib'
import useSWR from 'swr'

export interface SignalsProviderValue {
  // TODO define settings type
  userAddresses: string[]
  assetIds: string[]
  publisherIds: string[]
  settings?: any
  signals: SignalItem[]
  setAssetIds(assets: string[]): void
  usDetailSignal?: () => void
  useListSignals?: () => void
  error?: string
  loading: boolean
}

const refreshInterval = 120000 // 120 sec.

const SignalsContext = createContext({} as SignalsProviderValue)

function SignalsProvider({ children }: { children: ReactNode }): ReactElement {
  const {
    assetIds,
    originUrl,
    setAssetIds,
    fetchSignals,
    loading,
    setLoading,
    userAddresses,
    publisherIds,
    signalItems,
    setSignalItems
  } = useSignalsLoader('https://62c5a9c8134fa108c2591da2.mockapi.io/')
  useEffect(() => {
    // fetchSignals('api/rugs/v1/sample-signals')
  }, [])

  const onSuccess = async (data: SignalItem[]) => {
    if (!data) return
    console.log('[signals] Got new signal data.', data)
    setSignalItems(data)
    setLoading(false)
    console.log('isLoading signals', loading)
  }

  const onError = (error: any) => {
    LoggerInstance.error('[signals] loading error.', error)
  }

  const getQueryAssetIds = () => {
    if (assetIds.length === 0) return
    return assetIds.join(',')
  }

  /**
   * A method fetching signals from specified origin URL
   * @returns SignalOriginItem[]
   * @memberOf useSignalsLoader
   * */
  const fetchSignalsData = async (queryUrl: string): Promise<SignalItem[]> => {
    console.log('fetchSignalData', originUrl)
    console.log('isLoading signals', loading)
    setLoading(true)
    try {
      const data: SignalItem[] = await fetchSignals(queryUrl)
      return data
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  // Fetch new prices periodically with swr
  useSWR(
    () =>
      getQueryAssetIds() ? `${originUrl}?assetIds=${getQueryAssetIds()}` : null,
    fetchSignalsData,
    {
      refreshInterval,
      onSuccess,
      onError
    }
  )

  return (
    <SignalsContext.Provider
      value={
        {
          loading,
          userAddresses,
          assetIds,
          setAssetIds,
          publisherIds,
          signals: signalItems
        } as SignalsProviderValue
      }
    >
      {children}
    </SignalsContext.Provider>
  )
}

const useSignal = (): SignalsProviderValue => useContext(SignalsContext)

export { SignalsProvider, useSignal, SignalsContext }
