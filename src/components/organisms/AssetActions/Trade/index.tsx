import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean, useMetadata, usePricing } from '@oceanprotocol/react'
import { DDO } from '@oceanprotocol/lib'
import styles from './index.module.css'
import PriceUnit from '../../../atoms/Price/PriceUnit'
import Conversion from '../../../atoms/Price/Conversion'
import EtherscanLink from '../../../atoms/EtherscanLink'

import TradeForm from './TradeForm'
import DtBalance from '../../../../models/DtBalance'

export interface TradeItem {
  amount: number
  token: string
  maxAmount: number
}
export interface TradeLiquidity {
  ocean: number
  datatoken: number
  // in refrence to datatoken, buy = swap from ocean to dt ( buy dt) , sell = swap from dt to ocean (sell dt)
  type: 'buy' | 'sell'
}

const refreshInterval = 3000 // 3 sec, if the interval is bellow 3 seconds the price will be 0 all the time

export default function Trade({ ddo }: { ddo: DDO }): ReactElement {
  const { ocean, networkId, balance, accountId } = useOcean()
  const [dtBalance, setDtBalance] = useState<DtBalance>()
  const { price, refreshPrice } = useMetadata(ddo)
  const { dtSymbol } = usePricing(ddo)
  const [poolAddress, setPoolAddress] = useState<string>()
  const [maxDt, setMaxDt] = useState(0)
  const [maxOcean, setMaxOcean] = useState(0)
  useEffect(() => {
    // Re-fetch price periodically, triggering re-calculation of everything
    const interval = setInterval(
      async () => await refreshPrice(),
      refreshInterval
    )
    return () => clearInterval(interval)
  }, [ddo])
  useEffect(() => {
    if (!price || !accountId || !ddo) return
    setPoolAddress(price.address)
    async function getDtBalance() {
      const dtBalance = await ocean.datatokens.balance(ddo.dataToken, accountId)
      setDtBalance({
        ocean: Number(balance.ocean),
        datatoken: Number(dtBalance)
      })
    }
    getDtBalance()
  }, [price, accountId, ddo])

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
    <>
      <div className={styles.dataToken}>
        <PriceUnit price="1" symbol={dtSymbol} /> ={' '}
        <PriceUnit price={`${price?.value}`} />
        <Conversion price={`${price?.value}`} />
        <div className={styles.dataTokenLinks}>
          <EtherscanLink
            networkId={networkId}
            path={`address/${price?.address}`}
          >
            Pool
          </EtherscanLink>
          <EtherscanLink networkId={networkId} path={`token/${ddo.dataToken}`}>
            Datatoken
          </EtherscanLink>
        </div>
      </div>

      <TradeForm
        ddo={ddo}
        balance={dtBalance}
        maxDt={maxDt}
        maxOcean={maxOcean}
      />
    </>
  )
}
