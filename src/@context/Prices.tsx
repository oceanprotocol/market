import React, {
  useState,
  ReactElement,
  createContext,
  useContext,
  ReactNode
} from 'react'
import { fetchData } from '@utils/fetch'
import useSWR from 'swr'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import { LoggerInstance } from '@oceanprotocol/lib'

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
  const { appConfig } = useSiteMetadata()
  const baseToken = 'ocean-protocol'
  const tokenIds = 'ocean-protocol,ethereum,matic-network'
  const currencies = appConfig.currencies.join(',') // comma-separated list
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=${currencies}`

  const [prices, setPrices] = useState(initialData)

  const onSuccess = async (data: {
    [baseToken]: Prices
    ['matic-network']: Prices
  }) => {
    if (!data) return
    LoggerInstance.log('[prices] Got new OCEAN spot prices.', data[baseToken])
    // We need go integrate maticPrice based on baseToken to current Prices object as it's not included in the data response
    const maticPrice = data[baseToken].eur / data['matic-network'].eur // price of baseToken in EUR / price of Matic in EUR
    LoggerInstance.log('[prices] Got new OCEAN spot prices for Matic.')
    setPrices({ ...data[baseToken], matic: maticPrice })
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
