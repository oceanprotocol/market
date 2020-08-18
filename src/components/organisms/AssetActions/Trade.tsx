import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean, useMetadata } from '@oceanprotocol/react'
import { DDO } from '@oceanprotocol/lib'
import { formatCurrency } from '@coingecko/cryptoformat'
import styles from './Trade.module.css'

interface Balance {
  ocean: string
  dt: string
}

export default function Trade({ ddo }: { ddo: DDO }): ReactElement {
  const { ocean, accountId } = useOcean()
  const { getBestPool } = useMetadata()
  const [numTokens, setNumTokens] = useState()
  const [balance, setBalance] = useState<Balance>()
  const [sharesBalance, setSharesBalance] = useState()
  const [poolPrice, setPoolPrice] = useState<string>()
  const [dtPrice, setDtPrice] = useState<string>()
  const [dtSymbol, setDtSymbol] = useState<string>()

  useEffect(() => {
    async function init() {
      try {
        const { poolAddress, poolPrice } = await getBestPool(ddo.dataToken)
        setPoolPrice(poolPrice)

        const dtSymbol = await ocean.datatokens.getSymbol(
          ddo.dataToken,
          accountId
        )
        setDtSymbol(dtSymbol)

        const dtPrice = await ocean.pool.getDTPrice(accountId, poolAddress)
        setDtPrice(dtPrice)

        const numTokens = await ocean.pool.getNumTokens(accountId, poolAddress)
        setNumTokens(numTokens)

        const oceanReserve = await ocean.pool.getOceanReserve(
          accountId,
          poolAddress
        )
        const dtReserve = await ocean.pool.getDTReserve(accountId, poolAddress)
        setBalance({
          ocean: oceanReserve,
          dt: dtReserve
        })

        const sharesBalance = await ocean.pool.sharesBalance(
          accountId,
          poolAddress
        )
        setSharesBalance(sharesBalance)
      } catch (error) {
        console.error(error.message)
      }
    }
    init()
  }, [])

  return (
    <>
      <p>
        {numTokens} Pooled Tokens: <br />
        {balance && (
          <>
            <span className={styles.symbol}>OCEAN</span>{' '}
            {formatCurrency(Number(balance.ocean), '', 'en', false, true)}
            <br />
            <span className={styles.symbol}>{dtSymbol}</span> {balance.dt}
          </>
        )}
      </p>
      {poolPrice && (
        <p>
          Pool Price: <br />
          <span className={styles.symbol}>OCEAN</span>{' '}
          {formatCurrency(Number(poolPrice), '', 'en', false, true)}
        </p>
      )}
      {dtPrice && (
        <p>
          Data Token Price: <br />
          <span className={styles.symbol}>OCEAN</span>{' '}
          {formatCurrency(Number(dtPrice), '', 'en', false, true)}
        </p>
      )}
      {sharesBalance && (
        <p>
          Your Pool Shares: <br />
          {sharesBalance}
        </p>
      )}
    </>
  )
}
