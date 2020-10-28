import React, {
  useState,
  useEffect,
  ReactElement,
  createContext,
  useContext,
  ReactNode
} from 'react'
import { fetchData } from '../utils'
import useSWR from 'swr'
import { useSiteMetadata } from '../hooks/useSiteMetadata'
import { Logger } from '@oceanprotocol/lib'

interface PricesValue {
  prices: {
    [key: string]: number
  }
}

const initialData: PricesValue = {
  prices: {
    eur: 0.0,
    usd: 0.0,
    eth: 0.0,
    btc: 0.0
  }
}

const PricesContext = createContext(null)

export default function PricesProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const { appConfig } = useSiteMetadata()
  const tokenId = 'ocean-protocol'
  const currencies = appConfig.currencies.join(',') // comma-separated list
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=${currencies}&include_24hr_change=true`

  const [prices, setPrices] = useState(initialData)

  const { data } = useSWR(url, fetchData, {
    initialData,
    refreshInterval: 30000, // 30 sec.
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    onSuccess
  })

  async function onSuccess() {
    if (!data) return
    Logger.log(`Got new prices. ${JSON.stringify(data)}`)
    setPrices(data)
  }

  useEffect(() => {
    onSuccess()
  }, [data])

  return (
    <PricesContext.Provider value={{ prices }}>
      {children}
    </PricesContext.Provider>
  )
}

// Helper hook to access the provider values
const usePrices = (): PricesValue => useContext(PricesContext)

export { PricesProvider, usePrices, PricesValue }
