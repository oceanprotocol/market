import React, { ReactElement, useEffect, useState } from 'react'
import FormTrade from './FormTrade'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import Decimal from 'decimal.js'
import { Datatoken } from '@oceanprotocol/lib'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

export default function Trade(): ReactElement {
  const { accountId, balance, web3 } = useWeb3()
  const { isAssetNetwork } = useAsset()
  const [tokenBalance, setTokenBalance] = useState<PoolBalance>()
  const { asset } = useAsset()
  const [maxDt, setMaxDt] = useState('0')
  const [maxOcean, setMaxOcean] = useState('0')

  // Get datatoken balance, and combine with OCEAN balance from hooks into one object
  useEffect(() => {
    if (
      !web3 ||
      !accountId ||
      !isAssetNetwork ||
      !balance?.ocean ||
      !accountId ||
      !asset?.services[0].datatokenAddress
    )
      return

    async function getTokenBalance() {
      const datatokenInstance = new Datatoken(web3)
      const dtBalance = await datatokenInstance.balance(
        asset.services[0].datatokenAddress,
        accountId
      )
      setTokenBalance({
        baseToken: new Decimal(balance.ocean).toString(),
        datatoken: new Decimal(dtBalance).toString()
      })
    }
    getTokenBalance()
  }, [web3, balance.ocean, accountId, asset, isAssetNetwork])

  // Get maximum amount for either OCEAN or datatoken
  useEffect(() => {
    if (
      !isAssetNetwork ||
      !asset.accessDetails ||
      asset.accessDetails.price === 0
    )
      return

    async function getMaximum() {
      // const maxTokensInPool = await ocean.pool.getDTMaxBuyQuantity(
      //   price.address
      // )
      // setMaxDt(
      //   isValidNumber(maxTokensInPool)
      //     ? new Decimal(maxTokensInPool).toString()
      //     : '0'
      // )
      // const maxOceanInPool = await ocean.pool.getOceanMaxBuyQuantity(
      //   price.address
      // )
      // setMaxOcean(
      //   isValidNumber(maxOceanInPool)
      //     ? new Decimal(maxOceanInPool).toString()
      //     : '0'
      // )
    }
    getMaximum()
  }, [isAssetNetwork, balance.ocean, asset])

  return (
    <FormTrade
      asset={asset}
      balance={tokenBalance}
      maxDt={maxDt}
      maxOcean={maxOcean}
    />
  )
}
