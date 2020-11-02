import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean, useMetadata, usePricing } from '@oceanprotocol/react'
import { DDO, Logger } from '@oceanprotocol/lib'
import styles from './index.module.css'
import stylesActions from './Actions.module.css'
import PriceUnit from '../../../atoms/Price/PriceUnit'
import Button from '../../../atoms/Button'
import Add from './Add'
import Remove from './Remove'
import Tooltip from '../../../atoms/Tooltip'
import EtherscanLink from '../../../atoms/EtherscanLink'
import Token from './Token'
import TokenList from './TokenList'
import { graphql, useStaticQuery } from 'gatsby'

export interface Balance {
  ocean: number
  datatoken: number
}

const contentQuery = graphql`
  query PoolQuery {
    content: allFile(filter: { relativePath: { eq: "price.json" } }) {
      edges {
        node {
          childContentJson {
            pool {
              tooltips {
                price
                liquidity
              }
            }
          }
        }
      }
    }
  }
`

const refreshInterval = 10000 // 10 sec.

export default function Pool({ ddo }: { ddo: DDO }): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childContentJson.pool

  const { ocean, accountId, networkId } = useOcean()
  const { price, refreshPrice } = useMetadata(ddo)
  const { dtSymbol } = usePricing(ddo)

  const [poolTokens, setPoolTokens] = useState<string>()
  const [totalPoolTokens, setTotalPoolTokens] = useState<string>()
  const [userLiquidity, setUserLiquidity] = useState<Balance>()
  const [swapFee, setSwapFee] = useState<string>()

  const [showAdd, setShowAdd] = useState(false)
  const [showRemove, setShowRemove] = useState(false)

  const [hasAddedLiquidity, setHasAddedLiquidity] = useState(false)
  const [poolShare, setPoolShare] = useState<string>()
  const [totalUserLiquidityInOcean, setTotalUserLiquidityInOcean] = useState(0)
  const [totalLiquidityInOcean, setTotalLiquidityInOcean] = useState(0)

  const [
    creatorTotalLiquidityInOcean,
    setCreatorTotalLiquidityInOcean
  ] = useState(0)
  const [creatorLiquidity, setCreatorLiquidity] = useState<Balance>()
  const [creatorPoolTokens, setCreatorPoolTokens] = useState<string>()
  const [creatorPoolShare, setCreatorPoolShare] = useState<string>()
  // the purpose of the value is just to trigger the effect
  const [refreshPool, setRefreshPool] = useState(false)

  useEffect(() => {
    const hasAddedLiquidity =
      userLiquidity && (userLiquidity.ocean > 0 || userLiquidity.datatoken > 0)
    setHasAddedLiquidity(hasAddedLiquidity)

    const poolShare =
      price?.ocean &&
      price?.datatoken &&
      userLiquidity &&
      ((Number(poolTokens) / Number(totalPoolTokens)) * 100).toFixed(2)
    setPoolShare(poolShare)

    const totalUserLiquidityInOcean =
      userLiquidity?.ocean + userLiquidity?.datatoken * price?.value
    setTotalUserLiquidityInOcean(totalUserLiquidityInOcean)

    const totalLiquidityInOcean = price?.ocean + price?.datatoken * price?.value
    setTotalLiquidityInOcean(totalLiquidityInOcean)
  }, [userLiquidity, price, poolTokens, totalPoolTokens])

  useEffect(() => {
    if (!ocean || !accountId || !price) return

    async function init() {
      try {
        //
        // Get everything which is in the pool
        //
        const totalPoolTokens = await ocean.pool.getPoolSharesTotalSupply(
          price.address
        )
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
          (Number(poolTokens) / Number(totalPoolTokens)) * price.ocean

        const userDtBalance =
          (Number(poolTokens) / Number(totalPoolTokens)) * price.datatoken

        const userLiquidity = {
          ocean: userOceanBalance,
          datatoken: userDtBalance
        }

        setUserLiquidity(userLiquidity)

        //
        // Get everything the creator put into the pool
        //

        const creatorPoolTokens = await ocean.pool.sharesBalance(
          ddo.publicKey[0].owner,
          price.address
        )
        setCreatorPoolTokens(creatorPoolTokens)

        // calculate creator's provided liquidity based on pool tokens

        const creatorOceanBalance =
          (Number(creatorPoolTokens) / Number(totalPoolTokens)) * price.ocean

        const creatorDtBalance =
          (Number(creatorPoolTokens) / Number(totalPoolTokens)) *
          price.datatoken

        const creatorLiquidity = {
          ocean: creatorOceanBalance,
          datatoken: creatorDtBalance
        }
        setCreatorLiquidity(creatorLiquidity)

        const totalCreatorLiquidityInOcean =
          creatorLiquidity?.ocean + creatorLiquidity?.datatoken * price?.value
        setCreatorTotalLiquidityInOcean(totalCreatorLiquidityInOcean)

        const creatorPoolShare =
          price?.ocean &&
          price?.datatoken &&
          creatorLiquidity &&
          ((Number(creatorPoolTokens) / Number(totalPoolTokens)) * 100).toFixed(
            2
          )
        setCreatorPoolShare(creatorPoolShare)
        // Get swap fee
        // swapFee is tricky: to get 0.1% you need to convert from 0.001
        const swapFee = await ocean.pool.getSwapFee(price.address)
        setSwapFee(`${Number(swapFee) * 100}`)
      } catch (error) {
        Logger.error(error.message)
      }
    }
    init()

    // Re-fetch price periodically, triggering re-calculation of everything
    const interval = setInterval(() => refreshPrice(), refreshInterval)
    return () => clearInterval(interval)
  }, [ocean, accountId, price, ddo, refreshPool])

  const refreshInfo = async () => {
    setRefreshPool(!refreshPool)
    refreshPrice()
  }

  return (
    <>
      {showAdd ? (
        <Add
          setShowAdd={setShowAdd}
          refreshInfo={refreshInfo}
          poolAddress={price.address}
          totalPoolTokens={totalPoolTokens}
          totalBalance={{ ocean: price.ocean, datatoken: price.datatoken }}
          swapFee={swapFee}
          dtSymbol={dtSymbol}
          dtAddress={ddo.dataToken}
        />
      ) : showRemove ? (
        <Remove
          setShowRemove={setShowRemove}
          refreshInfo={refreshInfo}
          poolAddress={price.address}
          poolTokens={poolTokens}
          totalPoolTokens={totalPoolTokens}
          dtSymbol={dtSymbol}
        />
      ) : (
        <>
          <div className={styles.dataToken}>
            <PriceUnit price="1" symbol={dtSymbol} /> ={' '}
            <PriceUnit price={`${price?.value}`} />
            <Tooltip content={content.tooltips.price} />
            <div className={styles.dataTokenLinks}>
              <EtherscanLink
                networkId={networkId}
                path={`address/${price?.address}`}
              >
                Pool
              </EtherscanLink>
              <EtherscanLink
                networkId={networkId}
                path={`token/${ddo.dataToken}`}
              >
                Datatoken
              </EtherscanLink>
            </div>
          </div>

          <TokenList
            title={
              <>
                Your Liquidity
                <Tooltip content={content.tooltips.liquidity} />
              </>
            }
            ocean={`${userLiquidity?.ocean}`}
            dt={`${userLiquidity?.datatoken}`}
            dtSymbol={dtSymbol}
            poolShares={poolTokens}
            conversion={totalUserLiquidityInOcean}
            highlight
          >
            <Token symbol="% of pool" balance={poolShare} noIcon />
          </TokenList>

          <TokenList
            title="Pool Creator Liquidity"
            ocean={`${creatorLiquidity?.ocean}`}
            dt={`${creatorLiquidity?.datatoken}`}
            dtSymbol={dtSymbol}
            poolShares={creatorPoolTokens}
            conversion={creatorTotalLiquidityInOcean}
          >
            <Token symbol="% of pool" balance={creatorPoolShare} noIcon />
          </TokenList>

          <TokenList
            title="Pool Statistics"
            ocean={`${price?.ocean}`}
            dt={`${price?.datatoken}`}
            dtSymbol={dtSymbol}
            poolShares={totalPoolTokens}
            conversion={totalLiquidityInOcean}
          >
            <Token symbol="% swap fee" balance={swapFee} noIcon />
          </TokenList>

          <div className={styles.update}>
            Fetching every {refreshInterval / 1000} sec.
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
