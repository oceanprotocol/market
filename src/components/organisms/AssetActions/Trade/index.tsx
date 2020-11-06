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
}

const refreshInterval = 3000 // 10 sec, if the interval is bellow 3-5 seconds the price will be 0 all the time
export default function Trade({ ddo }: { ddo: DDO }): ReactElement {
  const { ocean, balance, accountId } = useOcean()
  const [dtBalance, setDtBalance] = useState<DtBalance>()
  const { price, refreshPrice } = useMetadata(ddo)
  const [poolAddress, setPoolAddress] = useState<string>()
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

    setPoolAddress(price.address)
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
    if (!ocean || !poolAddress || !price || price.value === 0) return

    async function getMaximum() {
      const maxCanBuy = Number(balance.ocean) / Number(price.value)
      const maxTokensInPool = await ocean.pool.getDTMaxBuyQuantity(poolAddress)
      setMaxDt(
        maxCanBuy > Number(maxTokensInPool)
          ? Number(maxTokensInPool)
          : maxCanBuy
      )

      const maxOceanInPool = await ocean.pool.getMaxBuyQuantity(
        poolAddress,
        ocean.pool.oceanAddress
      )
      setMaxOcean(Number(maxOceanInPool))
    }
    getMaximum()
  }, [ocean, poolAddress, balance.ocean, price])

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
