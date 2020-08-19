import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean, useMetadata } from '@oceanprotocol/react'
import { DDO } from '@oceanprotocol/lib'
import styles from './index.module.css'
import Token from './Token'
import PriceUnit from '../../../atoms/Price/PriceUnit'
import Loader from '../../../atoms/Loader'
import Button from '../../../atoms/Button'
import Add from './Add'
import Remove from './Remove'

interface Balance {
  ocean: string
  dt: string
}

export default function Pool({ ddo }: { ddo: DDO }): ReactElement {
  const { ocean, accountId } = useOcean()
  const { getBestPool } = useMetadata()
  const [poolAddress, setPoolAddress] = useState<string>()
  const [totalBalance, setTotalBalance] = useState<Balance>()
  const [dtPrice, setDtPrice] = useState<string>()
  const [dtSymbol, setDtSymbol] = useState<string>()
  const [userBalance, setUserBalance] = useState<Balance>()
  const [showAdd, setShowAdd] = useState<boolean>()
  const [showRemove, setShowRemove] = useState<boolean>()

  const isLoading = !ocean || !totalBalance || !userBalance || !dtPrice
  const hasAddedLiquidity =
    userBalance && (Number(userBalance.ocean) > 0 || Number(userBalance.dt) > 0)

  useEffect(() => {
    async function init() {
      try {
        const { poolAddress } = await getBestPool(ddo.dataToken)
        setPoolAddress(poolAddress)

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
          ocean: `${
            (Number(sharesBalance) / Number(dtReserve)) * Number(oceanReserve)
          }`,
          dt: sharesBalance
        }

        setUserBalance(userBalance)
      } catch (error) {
        console.error(error.message)
      }
    }
    init()
  }, [ocean, accountId])

  return (
    <>
      {isLoading ? (
        <Loader message="Retrieving pools..." />
      ) : showAdd ? (
        <Add
          setShowAdd={setShowAdd}
          dtSymbol={dtSymbol}
          poolAddress={poolAddress}
        />
      ) : showRemove ? (
        <Remove setShowRemove={setShowRemove} poolAddress={poolAddress} />
      ) : (
        <>
          <div className={styles.dataToken}>
            <PriceUnit price="1" symbol={dtSymbol} /> ={' '}
            <PriceUnit price={dtPrice} />
          </div>

          <div className={styles.poolTokens}>
            <div className={styles.tokens}>
              <h3 className={styles.title}>Your Pool Share</h3>
              <Token symbol="OCEAN" balance={userBalance.ocean} />
              <Token symbol={dtSymbol} balance={userBalance.dt} />
            </div>

            <div className={styles.tokens}>
              <h3 className={styles.title}>Total Pooled Tokens</h3>
              <Token symbol="OCEAN" balance={totalBalance.ocean} />
              <Token symbol={dtSymbol} balance={totalBalance.dt} />
            </div>
          </div>

          <div className={styles.actions}>
            <Button
              style="primary"
              size="small"
              onClick={() => setShowAdd(true)}
            >
              Add Liquidity
            </Button>

            {hasAddedLiquidity && (
              <Button size="small" onClick={() => setShowRemove(true)}>
                Remove
              </Button>
            )}
          </div>
        </>
      )}
    </>
  )
}
