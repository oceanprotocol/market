import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean, useMetadata } from '@oceanprotocol/react'
import { DDO } from '@oceanprotocol/lib'
import { formatCurrency } from '@coingecko/cryptoformat'
import styles from './index.module.css'
import Token from './Token'

interface Balance {
  ocean: string
  dt: string
}

export default function Pool({ ddo }: { ddo: DDO }): ReactElement {
  const { ocean, accountId } = useOcean()
  const { getBestPool } = useMetadata()
  const [totalBalance, setTotalBalance] = useState<Balance>()
  const [poolPrice, setPoolPrice] = useState<string>()
  const [dtPrice, setDtPrice] = useState<string>()
  const [dtSymbol, setDtSymbol] = useState<string>()
  const [userBalance, setUserBalance] = useState<Balance>()

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

        const oceanReserve = await ocean.pool.getOceanReserve(
          accountId,
          poolAddress
        )
        const dtReserve = await ocean.pool.getDTReserve(accountId, poolAddress)
        setTotalBalance({
          ocean: oceanReserve,
          dt: dtReserve
        })

        const sharesBalance = await ocean.pool.sharesBalance(
          accountId,
          poolAddress
        )

        const userBalance = {
          ocean: `${(sharesBalance / dtReserve) * oceanReserve}`,
          dt: sharesBalance
        }

        setUserBalance(userBalance)
      } catch (error) {
        console.error(error.message)
      }
    }
    init()
  }, [])

  return (
    <>
      <h3 className={styles.title}>Your Pooled Tokens</h3>
      {userBalance && (
        <div className={styles.tokens}>
          <Token symbol="OCEAN" balance={userBalance.ocean} />
          <Token symbol={dtSymbol} balance={userBalance.dt} />
        </div>
      )}

      <h3 className={styles.title}>Total Pooled Tokens</h3>
      {totalBalance && (
        <div className={styles.tokens}>
          <Token symbol="OCEAN" balance={totalBalance.ocean} />
          <Token symbol={dtSymbol} balance={totalBalance.dt} />
        </div>
      )}

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
    </>
  )
}
