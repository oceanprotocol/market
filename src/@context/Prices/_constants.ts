import { Prices } from './_types'
import { coingeckoTokenIds } from '../../../app.config'

export const initialData: Prices = coingeckoTokenIds.map((tokenId) => ({
  [tokenId]: {
    eur: 0.0,
    usd: 0.0,
    eth: 0.0,
    btc: 0.0
  }
}))[0]

export const refreshInterval = 120000 // 120 sec.
