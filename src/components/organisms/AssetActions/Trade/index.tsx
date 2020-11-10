import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean, useMetadata } from '@oceanprotocol/react'
import { DDO } from '@oceanprotocol/lib'
import FormTrade from './FormTrade'
import DtBalance from '../../../../models/DtBalance'

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
  const { ocean, balance, accountId } = useOcean()
  const [dtBalance, setDtBalance] = useState<DtBalance>()
  const { price, refreshPrice } = useMetadata(ddo)
  const [maxDt, setMaxDt] = useState(0)
  const [maxOcean, setMaxOcean] = useState(0)

  useEffect(() => {
    if (!ocean) return

    // Re-fetch price periodically, triggering re-calculation of everything
    const interval = setInterval(() => refreshPrice(), refreshInterval)
    return () => clearInterval(interval)
  }, [ocean, ddo, refreshPrice])

  useEffect(() => {
    if (!ocean || !price || !accountId || !ddo) return

    async function getDtBalance() {
      const dtBalance = await ocean.datatokens.balance(ddo.dataToken, accountId)
      setDtBalance({
        ocean: Number(balance.ocean),
        datatoken: Number(dtBalance)
      })
    }
    getDtBalance()
  }, [balance.ocean, ocean, price, accountId, ddo])

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
      balance={dtBalance}
      maxDt={maxDt}
      maxOcean={maxOcean}
    />
  )
}
