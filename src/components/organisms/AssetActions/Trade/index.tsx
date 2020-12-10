import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean } from '@oceanprotocol/react'
import FormTrade from './FormTrade'
import TokenBalance from '../../../../@types/TokenBalance'
import { useAsset } from '../../../../providers/Asset'

export default function Trade(): ReactElement {
  const { ocean, balance, accountId } = useOcean()
  const [tokenBalance, setTokenBalance] = useState<TokenBalance>()
  const { price, ddo } = useAsset()
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
