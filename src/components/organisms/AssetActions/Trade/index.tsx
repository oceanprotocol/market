import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean, useMetadata } from '@oceanprotocol/react'
import { DDO } from '@oceanprotocol/lib'
import FormTrade from './FormTrade'
import TokenBalance from '../../../../models/TokenBalance'

export interface TradeItem {
  amount: number
  token: string
  maxAmount: number
}

export interface TradeLiquidity {
  ocean: number
  datatoken: number
  // in reference to datatoken, buy = swap from ocean to dt ( buy dt) , sell = swap from dt to ocean (sell dt)
  type: 'buy' | 'sell'
  slippage: string
}

const refreshInterval = 6000 // 6 sec, if the interval is bellow 3-5 seconds the price will be 0 all the time

export default function Trade({ ddo }: { ddo: DDO }): ReactElement {
  const { ocean, balance, accountId, networkId, refreshBalance } = useOcean()
  const [tokenBalance, setTokenBalance] = useState<TokenBalance>()
  const { price, refreshPrice } = useMetadata(ddo)
  const [maxDt, setMaxDt] = useState(0)
  const [maxOcean, setMaxOcean] = useState(0)

  // Get datatoken balance, and combine with OCEAN balance from hooks into one object
  useEffect(() => {
    if (!ocean || !balance?.ocean || !accountId || !ddo?.dataToken) return

    async function getTokenBalance() {
      const dtBalance = await ocean.datatokens.balance(ddo.dataToken, accountId)
      setTokenBalance({
        ocean: Number(balance.ocean),
        datatoken: Number(dtBalance)
      })
    }
    getTokenBalance()
  }, [balance.ocean, ocean, accountId, ddo.dataToken])

  // Re-fetch price & balance periodically, triggering re-calculation of everything
  useEffect(() => {
    if (!ocean || !networkId || !accountId) return

    const interval = setInterval(async () => {
      refreshPrice()
      refreshBalance()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [ocean, ddo, networkId, accountId, refreshPrice, refreshBalance])

  // Get maximum amount for either OCEAN or datatoken
  useEffect(() => {
    if (!ocean || !price || price.value === 0) return

    async function getMaximum() {
      const maxTokensInPool = await ocean.pool.getDTMaxBuyQuantity(
        price.address
      )
      setMaxDt(Number(maxTokensInPool))

      const maxOceanInPool = await ocean.pool.getOceanMaxBuyQuantity(
        price.address
      )
      setMaxOcean(Number(maxOceanInPool))
    }
    getMaximum()
  }, [ocean, balance.ocean, price])

  return (
    <FormTrade
      ddo={ddo}
      price={price}
      balance={tokenBalance}
      maxDt={maxDt}
      maxOcean={maxOcean}
    />
  )
}
