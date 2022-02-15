import React, { ReactElement, useEffect, useState } from 'react'
import FormTrade from './FormTrade'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import { isValidNumber } from '@utils/numbers'
import Decimal from 'decimal.js'
import { Datatoken, LoggerInstance, Pool } from '@oceanprotocol/lib'
import { usePool } from '@context/Pool'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

export default function Trade(): ReactElement {
  const { accountId, balance, web3 } = useWeb3()
  const { isAssetNetwork } = useAsset()
  const [tokenBalance, setTokenBalance] = useState<PoolBalance>()
  const { asset } = useAsset()
  const { poolInfo } = usePool()

  const [maxDt, setMaxDt] = useState('0')
  const [maxBaseToken, setMaxBaseToken] = useState('0')

  // Get datatoken balance, and combine with OCEAN balance from hooks into one object
  useEffect(() => {
    if (
      !web3 ||
      !accountId ||
      !isAssetNetwork ||
      !balance?.ocean ||
      !accountId ||
      !poolInfo?.datatokenAddress
    )
      return

    async function getTokenBalance() {
      const datatokenInstance = new Datatoken(web3)
      const dtBalance = await datatokenInstance.balance(
        poolInfo.datatokenAddress,
        accountId
      )
      setTokenBalance({
        baseToken: new Decimal(balance.ocean).toString(),
        datatoken: new Decimal(dtBalance).toString()
      })
    }
    getTokenBalance()
  }, [
    web3,
    balance.ocean,
    accountId,
    poolInfo?.datatokenAddress,
    isAssetNetwork
  ])

  // Get maximum amount for either OCEAN or datatoken
  useEffect(() => {
    if (
      !web3 ||
      !isAssetNetwork ||
      !asset.accessDetails.addressOrId ||
      asset.accessDetails.price === 0
    )
      return

    async function getMaximum() {
      try {
        const poolInstance = new Pool(web3)

        const maxTokensInPool = await poolInstance.getReserve(
          asset.accessDetails.addressOrId,
          poolInfo.datatokenAddress
        )
        setMaxDt(
          isValidNumber(maxTokensInPool)
            ? new Decimal(maxTokensInPool).toString()
            : '0'
        )
        const maxBaseTokenInPool = await poolInstance.getReserve(
          asset.accessDetails.addressOrId,
          poolInfo.baseTokenAddress
        )
        setMaxBaseToken(
          isValidNumber(maxBaseTokenInPool)
            ? new Decimal(maxBaseTokenInPool).toString()
            : '0'
        )
      } catch (error) {
        LoggerInstance.log(error.message)
      }
    }
    getMaximum()
  }, [isAssetNetwork, web3, balance, asset, poolInfo])

  return (
    <FormTrade
      asset={asset}
      balance={tokenBalance}
      maxDt={maxDt}
      maxBaseToken={maxBaseToken}
    />
  )
}
