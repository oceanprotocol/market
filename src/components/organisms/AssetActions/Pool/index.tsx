import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean, useMetadata } from '@oceanprotocol/react'
import { DDO } from '@oceanprotocol/lib'
import styles from './index.module.css'
import stylesActions from './Actions.module.css'
import Token from './Token'
import PriceUnit from '../../../atoms/Price/PriceUnit'
import Loader from '../../../atoms/Loader'
import Button from '../../../atoms/Button'
import Add from './Add'
import Remove from './Remove'
import Tooltip from '../../../atoms/Tooltip'
import Conversion from '../../../atoms/Price/Conversion'
import EtherscanLink from '../../../atoms/EtherscanLink'
import { useUserPreferences } from '../../../../providers/UserPreferences'

export interface Balance {
  ocean: string
  dt: string
}

/* 
  TODO: create tooltip copy
*/

export default function Pool({ ddo }: { ddo: DDO }): ReactElement {
  const { debug } = useUserPreferences()
  const { ocean, accountId } = useOcean()
  const { price } = useMetadata(ddo)

  const [poolTokens, setPoolTokens] = useState<string>()
  const [totalPoolTokens, setTotalPoolTokens] = useState<string>()
  const [totalBalance, setTotalBalance] = useState<Balance>()
  const [dtSymbol, setDtSymbol] = useState<string>()
  const [userLiquidity, setUserBalance] = useState<Balance>()
  const [swapFee, setSwapFee] = useState<string>()

  const [showAdd, setShowAdd] = useState(false)
  const [showRemove, setShowRemove] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const hasAddedLiquidity =
    userLiquidity &&
    (Number(userLiquidity.ocean) > 0 || Number(userLiquidity.dt) > 0)

  const poolShare =
    totalBalance &&
    userLiquidity &&
    ((Number(poolTokens) / Number(totalPoolTokens)) * 100).toFixed(2)

  useEffect(() => {
    if (!ocean || !accountId || !price || !price.value) return

    async function init() {
      setIsLoading(true)

      try {
        //
        // Get data token symbol
        //
        const dtSymbol = await ocean.datatokens.getSymbol(ddo.dataToken)
        setDtSymbol(dtSymbol)

        //
        // Get everything which is in the pool
        //
        const oceanReserve = await ocean.pool.getOceanReserve(price.address)
        const dtReserve = await ocean.pool.getDTReserve(price.address)
        setTotalBalance({
          ocean: oceanReserve,
          dt: dtReserve
        })

        const totalPoolTokens = await ocean.pool.totalSupply(price.address)
        setTotalPoolTokens(totalPoolTokens)

        //
        // Get everything the user has put into the pool
        //
        const poolTokens = await ocean.pool.sharesBalance(
          accountId,
          price.address
        )
        setPoolTokens(poolTokens)

        // calculate user's provided liquidity based on pool tokens
        const userOceanBalance =
          (Number(poolTokens) / Number(totalPoolTokens)) * Number(oceanReserve)

        const userDtBalance =
          (Number(poolTokens) / Number(totalPoolTokens)) * Number(dtReserve)

        const userLiquidity = {
          ocean: `${userOceanBalance}`,
          dt: `${userDtBalance}`
        }

        setUserBalance(userLiquidity)

        // Get swap fee
        // swapFee is tricky: to get 0.1% you need to convert from 0.001
        const swapFee = await ocean.pool.getSwapFee(price.address)
        setSwapFee(`${Number(swapFee) * 100}`)
      } catch (error) {
        console.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [ocean, accountId, price, ddo.dataToken])

  return (
    <>
      {isLoading && !userLiquidity ? (
        <Loader message="Retrieving pools..." />
      ) : showAdd ? (
        <Add
          setShowAdd={setShowAdd}
          poolAddress={price.address}
          totalPoolTokens={totalPoolTokens}
          totalBalance={totalBalance}
          swapFee={swapFee}
          dtSymbol={dtSymbol}
          dtAddress={ddo.dataToken}
        />
      ) : showRemove ? (
        <Remove
          setShowRemove={setShowRemove}
          poolAddress={price.address}
          totalPoolTokens={totalPoolTokens}
          userLiquidity={userLiquidity}
        />
      ) : (
        <>
          <div className={styles.dataToken}>
            <PriceUnit price="1" symbol={dtSymbol} /> ={' '}
            <PriceUnit price={price.value} />
            <Conversion price={price.value} />
            <Tooltip content="Explain how this price is determined..." />
            <div className={styles.dataTokenLinks}>
              <EtherscanLink
                network="rinkeby"
                path={`address/${price.address}`}
              >
                Pool
              </EtherscanLink>
              <EtherscanLink network="rinkeby" path={`token/${ddo.dataToken}`}>
                Datatoken
              </EtherscanLink>
            </div>
          </div>

          <div className={styles.poolTokens}>
            <div className={styles.tokens}>
              <h3 className={styles.title}>
                Your Liquidity
                <Tooltip content="Explain what this represents, advantage of providing liquidity..." />
              </h3>
              <Token symbol="OCEAN" balance={userLiquidity.ocean} />
              <Token symbol={dtSymbol} balance={userLiquidity.dt} />
              {debug === true && <Token symbol="BPT" balance={poolTokens} />}
              <Token symbol="% of pool" balance={poolShare} />
            </div>

            <div className={styles.tokens}>
              <h3 className={styles.title}>Pool Statistics</h3>
              <Token symbol="OCEAN" balance={totalBalance.ocean} />
              <Token symbol={dtSymbol} balance={totalBalance.dt} />
              {debug === true && (
                <Token symbol="BPT" balance={totalPoolTokens} />
              )}
              <Token symbol="% swap fee" balance={swapFee} />
            </div>
          </div>

          <div className={stylesActions.actions}>
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
