import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean, useMetadata } from '@oceanprotocol/react'
import { DDO } from '@oceanprotocol/lib'
import styles from './index.module.css'
import Token from './Token'
import PriceUnit from '../../../atoms/Price/PriceUnit'

interface Balance {
  ocean: string
  dt: string
}

export default function Pool({ ddo }: { ddo: DDO }): ReactElement {
  const { ocean, accountId } = useOcean()
  const { getBestPool } = useMetadata()
  const [totalBalance, setTotalBalance] = useState<Balance>()
  const [dtPrice, setDtPrice] = useState<string>()
  const [dtSymbol, setDtSymbol] = useState<string>()
  const [userBalance, setUserBalance] = useState<Balance>()

  useEffect(() => {
    async function init() {
      try {
        const { poolAddress } = await getBestPool(ddo.dataToken)

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
      <div className={styles.dataToken}>
        <PriceUnit price="1" symbol={dtSymbol} /> ={' '}
        <PriceUnit price={dtPrice} />
      </div>

      <div className={styles.poolTokens}>
        {userBalance && (
          <div className={styles.tokens}>
            <h3 className={styles.title}>Your Pooled Tokens</h3>
            <Token symbol="OCEAN" balance={userBalance.ocean} />
            <Token symbol={dtSymbol} balance={userBalance.dt} />
          </div>
        )}

        {totalBalance && (
          <div className={styles.tokens}>
            <h3 className={styles.title}>Total Pooled Tokens</h3>
            <Token symbol="OCEAN" balance={totalBalance.ocean} />
            <Token symbol={dtSymbol} balance={totalBalance.dt} />
          </div>
        )}
      </div>
    </>
  )
}
