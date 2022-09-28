import React, {
  useState,
  ReactElement,
  createContext,
  useContext,
  ReactNode,
  useEffect
} from 'react'
import { fetchData } from '@utils/fetch'
import useSWR from 'swr'
import { LoggerInstance } from '@oceanprotocol/lib'
import { useMarketMetadata } from '../MarketMetadata'
import { Prices, PricesValue } from './_types'
import { initialData, refreshInterval } from './_constants'
import { getCoingeckoTokenId } from './_utils'

const PricesContext = createContext(null)

export default function PricesProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const { appConfig } = useMarketMetadata()

  const [prices, setPrices] = useState(initialData)
  const [url, setUrl] = useState<string>()

  useEffect(() => {
    if (!appConfig) return

    const currencies = appConfig.currencies.join(',')
    const tokenIds = appConfig.coingeckoTokenIds.join(',')
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=${currencies}`
    setUrl(url)
  }, [appConfig])

  const onSuccess = async (data: Prices) => {
    if (!data) return
    LoggerInstance.log('[prices] Got new spot prices.', data)
    setPrices(data)
  }

  // Fetch new prices periodically with swr
  useSWR(url, fetchData, {
    refreshInterval,
    onSuccess
  })

  return (
    <PricesContext.Provider value={{ prices }}>
      {children}
    </PricesContext.Provider>
  )
}

// Helper hook to access the provider values
const usePrices = (): PricesValue => useContext(PricesContext)

export { PricesProvider, usePrices, getCoingeckoTokenId }
