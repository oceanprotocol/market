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
import { useMarketMetadata } from './MarketMetadata'

interface Prices {
  [key: string]: number
}

interface PricesValue {
  prices: Prices
}

const initialData: Prices = {
  eur: 0.0,
  usd: 0.0,
  eth: 0.0,
  btc: 0.0
}

const refreshInterval = 120000 // 120 sec.

const PricesContext = createContext(null)

export default function PricesProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const { appConfig } = useMarketMetadata()
  const tokenId = 'ocean-protocol'

  const [prices, setPrices] = useState(initialData)
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (!appConfig) return
    // comma-separated list
    const currencies = appConfig.currencies.join(',')
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=${currencies}`
    setUrl(url)
  }, [appConfig])

  const onSuccess = async (data: { [tokenId]: Prices }) => {
    if (!data) return
    LoggerInstance.log('[prices] Got new OCEAN spot prices.', data[tokenId])
    setPrices(data[tokenId])
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

export { PricesProvider, usePrices }
