import React, { ReactElement, useEffect, useState } from 'react'
import FormTrade from './FormTrade'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import { isValidNumber } from '@utils/numbers'
import Decimal from 'decimal.js'
import { Datatoken, LoggerInstance, Pool } from '@oceanprotocol/lib'
import { usePool } from '@context/Pool'
import { getTokenBalanceFromSymbol } from '@utils/web3'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

export default function Trade(): ReactElement {
  const { accountId, balance, web3 } = useWeb3()
  const { isAssetNetwork } = useAsset()
  const [tokenBalance, setTokenBalance] = useState<PoolBalance>()
  const { asset } = useAsset()
  const { poolInfo } = usePool()

  // Get datatoken balance, and combine with baseToken balance from hooks into one object
  useEffect(() => {
    if (
      !web3 ||
      !accountId ||
      !isAssetNetwork ||
      !balance ||
      !accountId ||
      !poolInfo?.datatokenAddress ||
      !poolInfo?.baseTokenSymbol
    )
      return

    async function getTokenBalance() {
      const datatokenInstance = new Datatoken(web3)
      const dtBalance = await datatokenInstance.balance(
        poolInfo.datatokenAddress,
        accountId
      )
      const baseTokenBalance = getTokenBalanceFromSymbol(
        balance,
        poolInfo.baseTokenSymbol
      )
      setTokenBalance({
        baseToken: new Decimal(baseTokenBalance).toString(),
        datatoken: new Decimal(dtBalance).toString()
      })
    }
    getTokenBalance()
  }, [
    web3,
    balance,
    accountId,
    poolInfo?.datatokenAddress,
    poolInfo?.baseTokenSymbol,
    isAssetNetwork
  ])

  return <FormTrade asset={asset} balance={tokenBalance} />
}
