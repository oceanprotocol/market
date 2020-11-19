import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean, useMetadata, usePricing } from '@oceanprotocol/react'
import { BestPrice, DDO, Logger } from '@oceanprotocol/lib'
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
import TokenBalance from '../../../../@types/TokenBalance'
import Transactions from './Transactions'
import Graph, { ChartDataLiqudity } from './Graph'
import axios from 'axios'
import { useAsset } from '../../../../providers/Asset'

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

const refreshInterval = 15000 // 15 sec.

export default function Pool({ ddo }: { ddo: DDO }): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childContentJson.pool

  const { ocean, accountId, networkId, config } = useOcean()
  const { price, getLivePrice, owner } = useMetadata(ddo)
  const [livePrice, setLivePrice] = useState<BestPrice>(price)

  const { dtSymbol } = usePricing(ddo)
  const { isInPurgatory } = useAsset()

  const [poolTokens, setPoolTokens] = useState<string>()
  const [totalPoolTokens, setTotalPoolTokens] = useState<string>()
  const [userLiquidity, setUserLiquidity] = useState<TokenBalance>()
  const [swapFee, setSwapFee] = useState<string>()
  const [weightOcean, setWeightOcean] = useState<string>()
  const [weightDt, setWeightDt] = useState<string>()

  const [showAdd, setShowAdd] = useState(false)
  const [showRemove, setShowRemove] = useState(false)
  const [isRemoveDisabled, setIsRemoveDisabled] = useState(false)

  const [hasAddedLiquidity, setHasAddedLiquidity] = useState(false)
  const [poolShare, setPoolShare] = useState<string>()
  const [totalUserLiquidityInOcean, setTotalUserLiquidityInOcean] = useState(0)
  const [totalLiquidityInOcean, setTotalLiquidityInOcean] = useState(0)

  const [
    creatorTotalLiquidityInOcean,
    setCreatorTotalLiquidityInOcean
  ] = useState(0)
  const [creatorLiquidity, setCreatorLiquidity] = useState<TokenBalance>()
  const [creatorPoolTokens, setCreatorPoolTokens] = useState<string>()
  const [creatorPoolShare, setCreatorPoolShare] = useState<string>()
  const [graphData, setGraphData] = useState<ChartDataLiqudity>()

  // the purpose of the value is just to trigger the effect
  const [refreshPool, setRefreshPool] = useState(false)

  useEffect(() => {
    // Re-fetch price periodically, triggering re-calculation of everything
    let isMounted = true
    const interval = setInterval(async () => {
      if (!isMounted) return
      setLivePrice(await getLivePrice())
    }, refreshInterval)
    return () => {
      clearInterval(interval)
      isMounted = false
    }
  }, [ddo, getLivePrice])

  useEffect(() => {
    setIsRemoveDisabled(isInPurgatory && owner === accountId)
  }, [isInPurgatory, owner, accountId])

  useEffect(() => {
    const poolShare =
      livePrice?.ocean &&
      livePrice?.datatoken &&
      ((Number(poolTokens) / Number(totalPoolTokens)) * 100).toFixed(5)
    setPoolShare(poolShare)
    setHasAddedLiquidity(Number(poolShare) > 0)

    const totalUserLiquidityInOcean =
      userLiquidity?.ocean + userLiquidity?.datatoken * livePrice?.value
    setTotalUserLiquidityInOcean(totalUserLiquidityInOcean)

    const totalLiquidityInOcean =
      livePrice?.ocean + livePrice?.datatoken * livePrice?.value
    setTotalLiquidityInOcean(totalLiquidityInOcean)
  }, [userLiquidity, livePrice, poolTokens, totalPoolTokens])

  useEffect(() => {
    if (!ocean || !accountId || !livePrice) return

    async function init() {
      try {
        //
        // Get everything which is in the pool
        //
        const totalPoolTokens = await ocean.pool.getPoolSharesTotalSupply(
          livePrice.address
        )
        setTotalPoolTokens(totalPoolTokens)

        //
        // Get everything the user has put into the pool
        //
        const poolTokens = await ocean.pool.sharesBalance(
          accountId,
          livePrice.address
        )
        setPoolTokens(poolTokens)

        // calculate user's provided liquidity based on pool tokens
        const userOceanBalance =
          (Number(poolTokens) / Number(totalPoolTokens)) * livePrice.ocean

        const userDtBalance =
          (Number(poolTokens) / Number(totalPoolTokens)) * livePrice.datatoken

        const userLiquidity = {
          ocean: userOceanBalance,
          datatoken: userDtBalance
        }

        setUserLiquidity(userLiquidity)

        //
        // Get everything the creator put into the pool
        //
        const creatorPoolTokens = await ocean.pool.sharesBalance(
          owner,
          livePrice.address
        )
        setCreatorPoolTokens(creatorPoolTokens)

        // Calculate creator's provided liquidity based on pool tokens
        const creatorOceanBalance =
          (Number(creatorPoolTokens) / Number(totalPoolTokens)) *
          livePrice.ocean

        const creatorDtBalance =
          (Number(creatorPoolTokens) / Number(totalPoolTokens)) *
          livePrice.datatoken

        const creatorLiquidity = {
          ocean: creatorOceanBalance,
          datatoken: creatorDtBalance
        }
        setCreatorLiquidity(creatorLiquidity)

        const totalCreatorLiquidityInOcean =
          creatorLiquidity?.ocean +
          creatorLiquidity?.datatoken * livePrice?.value
        setCreatorTotalLiquidityInOcean(totalCreatorLiquidityInOcean)

        const creatorPoolShare =
          livePrice?.ocean &&
          livePrice?.datatoken &&
          creatorLiquidity &&
          ((Number(creatorPoolTokens) / Number(totalPoolTokens)) * 100).toFixed(
            2
          )
        setCreatorPoolShare(creatorPoolShare)

        // Get swap fee
        // swapFee is tricky: to get 0.1% you need to convert from 0.001
        const swapFee = await ocean.pool.getSwapFee(livePrice.address)
        setSwapFee(`${Number(swapFee) * 100}`)

        // Get weights
        const weightDt = await ocean.pool.getDenormalizedWeight(
          livePrice.address,
          ddo.dataToken
        )
        setWeightDt(`${Number(weightDt) * 10}`)
        setWeightOcean(`${100 - Number(weightDt) * 10}`)
      } catch (error) {
        Logger.error(error.message)
      }
    }
    init()
  }, [ocean, accountId, livePrice, ddo, refreshPool, owner])

  // Get graph history data
  useEffect(() => {
    if (
      !livePrice?.address ||
      !livePrice?.ocean ||
      !livePrice?.value ||
      !config?.metadataCacheUri
    )
      return

    const source = axios.CancelToken.source()
    const url = `${config.metadataCacheUri}/api/v1/aquarius/pools/history/${livePrice.address}`

    async function getData() {
      Logger.log('Fired GetGraphData!')
      try {
        const response = await axios(url, { cancelToken: source.token })
        if (!response || response.status !== 200) return
        setGraphData(response.data)
      } catch (error) {
        if (axios.isCancel(error)) {
          Logger.log(error.message)
        } else {
          Logger.error(error.message)
        }
      }
    }
    getData()

    return () => {
      source.cancel()
    }
  }, [
    config.metadataCacheUri,
    livePrice?.address,
    livePrice?.ocean,
    livePrice?.value
  ])

  const refreshInfo = async () => {
    setRefreshPool(!refreshPool)
    setLivePrice(await getLivePrice())
  }

  return (
    <>
      {showAdd ? (
        <Add
          setShowAdd={setShowAdd}
          refreshInfo={refreshInfo}
          poolAddress={livePrice.address}
          totalPoolTokens={totalPoolTokens}
          totalBalance={{
            ocean: livePrice.ocean,
            datatoken: livePrice.datatoken
          }}
          swapFee={swapFee}
          dtSymbol={dtSymbol}
          dtAddress={ddo.dataToken}
        />
      ) : showRemove ? (
        <Remove
          setShowRemove={setShowRemove}
          refreshInfo={refreshInfo}
          poolAddress={livePrice.address}
          poolTokens={poolTokens}
          totalPoolTokens={totalPoolTokens}
          dtSymbol={dtSymbol}
        />
      ) : (
        <>
          <div className={styles.dataToken}>
            <PriceUnit price="1" symbol={dtSymbol} /> ={' '}
            <PriceUnit price={`${livePrice?.value}`} />
            <Tooltip content={content.tooltips.price} />
            <div className={styles.dataTokenLinks}>
              <EtherscanLink
                networkId={networkId}
                path={`address/${livePrice?.address}`}
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
            title={
              <>
                Pool Statistics
                {weightDt && (
                  <span
                    className={styles.titleInfo}
                    title={`Weight of ${weightOcean}% OCEAN & ${weightDt}% ${dtSymbol}`}
                  >
                    {weightOcean}/{weightDt}
                  </span>
                )}
                <Graph data={graphData} />
              </>
            }
            ocean={`${livePrice?.ocean}`}
            dt={`${livePrice?.datatoken}`}
            dtSymbol={dtSymbol}
            poolShares={totalPoolTokens}
            conversion={totalLiquidityInOcean}
          >
            <Token symbol="% swap fee" balance={swapFee} noIcon />
          </TokenList>

          {ocean && (
            <div className={styles.update}>
              Fetching every {refreshInterval / 1000} sec.
            </div>
          )}

          <div className={stylesActions.actions}>
            {!isInPurgatory && (
              <Button
                style="primary"
                size="small"
                onClick={() => setShowAdd(true)}
                disabled={isInPurgatory}
              >
                Add Liquidity
              </Button>
            )}

            {hasAddedLiquidity && !isRemoveDisabled && (
              <Button size="small" onClick={() => setShowRemove(true)}>
                Remove
              </Button>
            )}
          </div>

          {accountId && <Transactions poolAddress={livePrice?.address} />}
        </>
      )}
    </>
  )
}
