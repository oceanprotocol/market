import { Prices } from './_types'

// Refers to Coingecko API tokenIds
export const tokenIds = 'ocean-protocol,h2o'

export const initialData: Prices = tokenIds.split(',').map((tokenId) => ({
  [tokenId]: {
    eur: 0.0,
    usd: 0.0,
    eth: 0.0,
    btc: 0.0
  }
}))[0]

export const refreshInterval = 120000 // 120 sec.
