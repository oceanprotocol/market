import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean, useMetadata } from '@oceanprotocol/react'
import { BestPrice, DDO } from '@oceanprotocol/lib'
import FormTrade from './FormTrade'
import TokenBalance from '../../../../@types/TokenBalance'

const refreshInterval = 10000 // 10 sec, if the interval is bellow 3-5 seconds the price will be 0 all the time

export default function Trade({ ddo }: { ddo: DDO }): ReactElement {
  const { ocean, balance, accountId, networkId, refreshBalance } = useOcean()
  const [tokenBalance, setTokenBalance] = useState<TokenBalance>()
  const { price, getLivePrice } = useMetadata(ddo)
  const [maxDt, setMaxDt] = useState(0)
  const [maxOcean, setMaxOcean] = useState(0)
  const [livePrice, setLivePrice] = useState<BestPrice>(price)

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

    let isMounted = true
    const interval = setInterval(async () => {
      if (!isMounted) return
      setLivePrice(await getLivePrice())
      refreshBalance()
    }, refreshInterval)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [ocean, ddo, networkId, accountId, getLivePrice, refreshBalance])

  // Get maximum amount for either OCEAN or datatoken
  useEffect(() => {
    if (!ocean || !livePrice || livePrice.value === 0) return

    async function getMaximum() {
      const maxTokensInPool = await ocean.pool.getDTMaxBuyQuantity(
        livePrice.address
      )
      setMaxDt(Number(maxTokensInPool))

      const maxOceanInPool = await ocean.pool.getOceanMaxBuyQuantity(
        livePrice.address
      )
      setMaxOcean(Number(maxOceanInPool))
    }
    getMaximum()
  }, [ocean, balance.ocean, livePrice])

  return (
    <FormTrade
      ddo={ddo}
      price={livePrice}
      balance={tokenBalance}
      maxDt={maxDt}
      maxOcean={maxOcean}
    />
  )
}
