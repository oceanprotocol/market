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
import Tooltip from '../../../atoms/Tooltip'
import Conversion from '../../../atoms/Price/Conversion'
import EtherscanLink from '../../../atoms/EtherscanLink'

export interface Balance {
  ocean: string
  dt: string
}

export default function Pool({ ddo }: { ddo: DDO }): ReactElement {
  const { ocean, accountId } = useOcean()
  const { price, poolAddress } = useMetadata(ddo)

  const [poolTokens, setPoolTokens] = useState<string>()
  const [totalPoolTokens, setTotalPoolTokens] = useState<string>()
  const [totalBalance, setTotalBalance] = useState<Balance>()
  const [dtSymbol, setDtSymbol] = useState<string>()
  const [userBalance, setUserBalance] = useState<Balance>()

  const [showAdd, setShowAdd] = useState(false)
  const [showRemove, setShowRemove] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const hasAddedLiquidity =
    userBalance && (Number(userBalance.ocean) > 0 || Number(userBalance.dt) > 0)

  const poolShare =
    totalBalance &&
    userBalance &&
    ((Number(poolTokens) / Number(totalPoolTokens)) * 100).toFixed(2)

  useEffect(() => {
    if (!ocean || !accountId || !poolAddress || !price) return

    async function init() {
      setIsLoading(true)

      try {
        const dtSymbol = await ocean.datatokens.getSymbol(
          ddo.dataToken,
          accountId
        )
        setDtSymbol(dtSymbol)

        const oceanReserve = await ocean.pool.getOceanReserve(
          accountId,
          poolAddress
        )
        const dtReserve = await ocean.pool.getDTReserve(accountId, poolAddress)
        setTotalBalance({
          ocean: oceanReserve,
          dt: dtReserve
        })

        const poolTokens = await ocean.pool.sharesBalance(
          accountId,
          poolAddress
        )
        setPoolTokens(poolTokens)

        const totalPoolTokens = await ocean.pool.totalSupply(poolAddress)
        setTotalPoolTokens(totalPoolTokens)

        const userBalance = {
          ocean: `${
            (Number(poolTokens) / Number(totalPoolTokens)) *
            Number(oceanReserve)
          }`,
          dt: '-'
        }

        setUserBalance(userBalance)
      } catch (error) {
        console.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [ocean, accountId, price, poolAddress])

  return (
    <>
      {isLoading && !userBalance ? (
        <Loader message="Retrieving pools..." />
      ) : showAdd ? (
        <Add
          setShowAdd={setShowAdd}
          dtSymbol={dtSymbol}
          poolAddress={poolAddress}
          totalPoolTokens={totalPoolTokens}
          totalBalance={totalBalance}
        />
      ) : showRemove ? (
        <Remove setShowRemove={setShowRemove} poolAddress={poolAddress} />
      ) : (
        <>
          <div className={styles.dataToken}>
            <PriceUnit price="1" symbol={dtSymbol} /> ={' '}
            <PriceUnit price={price} />
            <Conversion price={price} />
            <Tooltip content="Explain how this price is determined..." />
            <div className={styles.dataTokenLinks}>
              <EtherscanLink network="rinkeby" path={`address/${poolAddress}`}>
                Pool
              </EtherscanLink>
              <EtherscanLink network="rinkeby" path={`token/${ddo.dataToken}`}>
                Data Token
              </EtherscanLink>
            </div>
          </div>

          <div className={styles.poolTokens}>
            <div className={styles.tokens}>
              <h3 className={styles.title}>
                Your Liquidity{' '}
                <Tooltip content="Explain what this represents, advantage of providing liquidity..." />
              </h3>
              <Token symbol="OCEAN" balance={userBalance.ocean} />
              <Token symbol={dtSymbol} balance={userBalance.dt} />
              <Token symbol="BPT" balance={poolTokens} />
              <Token symbol="%" balance={poolShare} />
            </div>

            <div className={styles.tokens}>
              <h3 className={styles.title}>Pool Statistics</h3>
              <Token symbol="OCEAN" balance={totalBalance.ocean} />
              <Token symbol={dtSymbol} balance={totalBalance.dt} />
              <Token symbol="BPT" balance={totalPoolTokens} />
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
