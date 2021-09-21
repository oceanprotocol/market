import React, { ReactElement, useEffect, useState } from 'react'
import { Logger } from '@oceanprotocol/lib'
import styles from './index.module.css'
import stylesActions from './Actions.module.css'
import PriceUnit from '../../../atoms/Price/PriceUnit'
import Button from '../../../atoms/Button'
import Add from './Add'
import Remove from './Remove'
import Tooltip from '../../../atoms/Tooltip'
import ExplorerLink from '../../../atoms/ExplorerLink'
import Token from './Token'
import TokenList from './TokenList'
import { graphql, useStaticQuery } from 'gatsby'
import { PoolBalance } from '../../../../@types/TokenBalance'
import AssetActionHistoryTable from '../../AssetActionHistoryTable'
import Graph from './Graph'
import { useAsset } from '../../../../providers/Asset'
import { gql, OperationResult } from 'urql'
import { PoolLiquidity } from '../../../../@types/apollo/PoolLiquidity'
import { useOcean } from '../../../../providers/Ocean'
import { useWeb3 } from '../../../../providers/Web3'
import PoolTransactions from '../../../molecules/PoolTransactions'
import { fetchData, getQueryContext } from '../../../../utils/subgraph'

import { isValidNumber } from './../../../../utils/numberValidations'
import Decimal from 'decimal.js'

const REFETCH_INTERVAL = 5000

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

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
const poolLiquidityQuery = gql`
  query PoolLiquidity($id: ID!, $shareId: ID) {
    pool(id: $id) {
      id
      totalShares
      swapFee
      spotPrice
      tokens {
        address
        symbol
        isDatatoken
        balance
        denormWeight
      }
      shares(where: { id: $shareId }) {
        id
        balance
      }
    }
  }
`

const userPoolShareQuery = gql`
  query PoolShare($id: ID!, $shareId: ID) {
    pool(id: $id) {
      id
      shares(where: { id: $shareId }) {
        id
        balance
      }
    }
  }
`

export default function Pool(): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childContentJson.pool

  const { accountId } = useWeb3()
  const [dtSymbol, setDtSymbol] = useState<string>()
  const [oceanSymbol, setOceanSymbol] = useState<string>()
  const { isInPurgatory, ddo, owner, price, refreshInterval, isAssetNetwork } =
    useAsset()

  const [poolTokens, setPoolTokens] = useState<string>()
  const [totalPoolTokens, setTotalPoolTokens] = useState<string>()
  const [userLiquidity, setUserLiquidity] = useState<PoolBalance>()
  const [swapFee, setSwapFee] = useState<string>()
  const [weightOcean, setWeightOcean] = useState<string>()
  const [weightDt, setWeightDt] = useState<string>()

  const [showAdd, setShowAdd] = useState(false)
  const [showRemove, setShowRemove] = useState(false)
  const [isRemoveDisabled, setIsRemoveDisabled] = useState(false)

  const [hasAddedLiquidity, setHasAddedLiquidity] = useState(false)
  const [poolShare, setPoolShare] = useState<string>()
  const [totalUserLiquidityInOcean, setTotalUserLiquidityInOcean] = useState(
    new Decimal(0)
  )
  const [totalLiquidityInOcean, setTotalLiquidityInOcean] = useState(
    new Decimal(0)
  )

  const [creatorTotalLiquidityInOcean, setCreatorTotalLiquidityInOcean] =
    useState(new Decimal(0))
  const [creatorLiquidity, setCreatorLiquidity] = useState<PoolBalance>()
  const [creatorPoolTokens, setCreatorPoolTokens] = useState<string>()
  const [creatorPoolShare, setCreatorPoolShare] = useState<string>()
  const [dataLiquidity, setdataLiquidity] = useState<PoolLiquidity>()
  const [liquidityFetchInterval, setLiquidityFetchInterval] =
    useState<NodeJS.Timeout>()

  // the purpose of the value is just to trigger the effect
  const [refreshPool, setRefreshPool] = useState(false)

  async function getPoolLiquidity() {
    const queryContext = getQueryContext(ddo.chainId)
    const queryVariables = {
      id: price.address.toLowerCase(),
      shareId: `${price.address.toLowerCase()}-${ddo.publicKey[0].owner.toLowerCase()}`
    }

    const queryResult: OperationResult<PoolLiquidity> = await fetchData(
      poolLiquidityQuery,
      queryVariables,
      queryContext
    )
    setdataLiquidity(queryResult?.data)
  }

  async function getUserPoolShareBalance() {
    const queryContext = getQueryContext(ddo.chainId)
    const queryVariables = {
      id: price.address.toLowerCase(),
      shareId: `${price.address.toLowerCase()}-${accountId.toLowerCase()}`
    }

    const queryResult: OperationResult<PoolLiquidity> = await fetchData(
      userPoolShareQuery,
      queryVariables,
      queryContext
    )
    return queryResult?.data.pool.shares[0]?.balance
  }

  function refetchLiquidity() {
    if (!liquidityFetchInterval) {
      setLiquidityFetchInterval(
        setInterval(function () {
          getPoolLiquidity()
        }, REFETCH_INTERVAL)
      )
    }
  }

  useEffect(() => {
    return () => {
      clearInterval(liquidityFetchInterval)
    }
  }, [liquidityFetchInterval])

  useEffect(() => {
    async function init() {
      if (!dataLiquidity || !dataLiquidity.pool) {
        await getPoolLiquidity()
        return
      }

      // Set symbols
      dataLiquidity.pool.tokens.forEach((token) => {
        token.isDatatoken
          ? setDtSymbol(token.symbol)
          : setOceanSymbol(token.symbol)
      })
      // Total pool shares
      const totalPoolTokens = dataLiquidity.pool.totalShares
      setTotalPoolTokens(totalPoolTokens)

      // Get swap fee
      // swapFee is tricky: to get 0.1% you need to convert from 0.001
      const swapFee = isValidNumber(dataLiquidity.pool.swapFee)
        ? new Decimal(dataLiquidity.pool.swapFee).mul(100).toString()
        : '0'

      setSwapFee(swapFee)

      // Get weights
      const weightDt = dataLiquidity.pool.tokens.filter(
        (token: any) => token.address === ddo.dataToken.toLowerCase()
      )[0].denormWeight

      const weightDtDecimal = isValidNumber(weightDt)
        ? new Decimal(weightDt).mul(10).toString()
        : '0'

      setWeightDt(weightDtDecimal)

      const weightOceanDecimal = isValidNumber(weightDt)
        ? new Decimal(100).minus(new Decimal(weightDt).mul(10)).toString()
        : '0'

      setWeightOcean(weightOceanDecimal)

      //
      // Get everything the creator put into the pool
      //

      const creatorPoolTokens = dataLiquidity.pool.shares[0].balance
      setCreatorPoolTokens(creatorPoolTokens)

      const creatorOceanBalance =
        isValidNumber(creatorPoolTokens) &&
        isValidNumber(totalPoolTokens) &&
        isValidNumber(price.ocean)
          ? new Decimal(creatorPoolTokens)
              .dividedBy(new Decimal(totalPoolTokens))
              .mul(price.ocean)
              .toString()
          : '0'

      const creatorDtBalance =
        isValidNumber(creatorPoolTokens) &&
        isValidNumber(totalPoolTokens) &&
        isValidNumber(price.datatoken)
          ? new Decimal(creatorPoolTokens)
              .dividedBy(new Decimal(totalPoolTokens))
              .mul(price.datatoken)
              .toString()
          : '0'

      const creatorLiquidity = {
        ocean: creatorOceanBalance,
        datatoken: creatorDtBalance
      }
      setCreatorLiquidity(creatorLiquidity)

      const totalCreatorLiquidityInOcean =
        isValidNumber(creatorLiquidity?.ocean) &&
        isValidNumber(creatorLiquidity?.datatoken) &&
        isValidNumber(dataLiquidity.pool.spotPrice)
          ? new Decimal(creatorLiquidity?.ocean).add(
              new Decimal(creatorLiquidity?.datatoken).mul(
                new Decimal(dataLiquidity.pool.spotPrice)
              )
            )
          : new Decimal(0)

      setCreatorTotalLiquidityInOcean(totalCreatorLiquidityInOcean)

      const creatorPoolShare =
        price?.ocean &&
        price?.datatoken &&
        creatorLiquidity &&
        isValidNumber(creatorPoolTokens) &&
        isValidNumber(totalPoolTokens)
          ? new Decimal(creatorPoolTokens)
              .dividedBy(new Decimal(totalPoolTokens))
              .mul(100)
              .toFixed(2)
          : '0'

      setCreatorPoolShare(creatorPoolShare)
      refetchLiquidity()
    }
    init()
  }, [dataLiquidity, ddo.dataToken, price.datatoken, price.ocean, price?.value])

  useEffect(() => {
    setIsRemoveDisabled(isInPurgatory && owner === accountId)
  }, [isInPurgatory, owner, accountId])

  useEffect(() => {
    if (!dataLiquidity) return
    const poolShare =
      isValidNumber(poolTokens) &&
      isValidNumber(totalPoolTokens) &&
      price?.ocean &&
      price?.datatoken &&
      new Decimal(poolTokens)
        .dividedBy(new Decimal(totalPoolTokens))
        .mul(100)
        .toFixed(5)

    setPoolShare(poolShare)
    setHasAddedLiquidity(Number(poolShare) > 0)

    const totalUserLiquidityInOcean =
      isValidNumber(userLiquidity?.ocean) &&
      isValidNumber(userLiquidity?.datatoken) &&
      isValidNumber(dataLiquidity.pool.spotPrice)
        ? new Decimal(userLiquidity?.ocean).add(
            new Decimal(userLiquidity?.datatoken).mul(
              dataLiquidity.pool.spotPrice
            )
          )
        : new Decimal(0)

    setTotalUserLiquidityInOcean(totalUserLiquidityInOcean)

    const totalLiquidityInOcean =
      isValidNumber(price?.ocean) &&
      isValidNumber(price?.datatoken) &&
      isValidNumber(dataLiquidity.pool.spotPrice)
        ? new Decimal(price?.ocean).add(
            new Decimal(price?.datatoken).mul(dataLiquidity.pool.spotPrice)
          )
        : new Decimal(0)

    setTotalLiquidityInOcean(totalLiquidityInOcean)
  }, [userLiquidity, price, poolTokens, totalPoolTokens])

  useEffect(() => {
    if (!accountId || !price) return
    async function init() {
      try {
        //
        // Get everything the user has put into the pool
        //
        const poolTokens = await getUserPoolShareBalance()
        setPoolTokens(poolTokens)

        // calculate user's provided liquidity based on pool tokens
        const userOceanBalance =
          isValidNumber(poolTokens) &&
          isValidNumber(totalPoolTokens) &&
          isValidNumber(price.ocean)
            ? new Decimal(poolTokens)
                .dividedBy(new Decimal(totalPoolTokens))
                .mul(price.ocean)
                .toString()
            : '0'

        const userDtBalance =
          isValidNumber(poolTokens) &&
          isValidNumber(totalPoolTokens) &&
          isValidNumber(price.datatoken)
            ? new Decimal(poolTokens)
                .dividedBy(new Decimal(totalPoolTokens))
                .mul(price.datatoken)
                .toString()
            : '0'

        const userLiquidity = {
          ocean: userOceanBalance,
          datatoken: userDtBalance
        }

        setUserLiquidity(userLiquidity)
      } catch (error) {
        Logger.error(error.message)
      }
    }
    init()
  }, [accountId, price, ddo, refreshPool, owner, totalPoolTokens])

  const refreshInfo = async () => {
    setRefreshPool(!refreshPool)

    // need some form of replacement or something.
    // await refreshPrice()
  }

  return (
    <>
      {showAdd ? (
        <Add
          setShowAdd={setShowAdd}
          refreshInfo={refreshInfo}
          poolAddress={price.address}
          totalPoolTokens={totalPoolTokens}
          totalBalance={{
            ocean: new Decimal(price.ocean).toString(),
            datatoken: new Decimal(price.datatoken).toString()
          }}
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
            <PriceUnit price={`${price?.value}`} symbol={oceanSymbol} />
            <Tooltip content={content.tooltips.price} />
            <div className={styles.dataTokenLinks}>
              <ExplorerLink
                networkId={ddo.chainId}
                path={`address/${price?.address}`}
              >
                Pool
              </ExplorerLink>
              <ExplorerLink
                networkId={ddo.chainId}
                path={
                  ddo.chainId === 2021000 || ddo.chainId === 1287
                    ? `tokens/${ddo.dataToken}`
                    : `token/${ddo.dataToken}`
                }
              >
                Datatoken
              </ExplorerLink>
            </div>
          </div>

          <TokenList
            title={
              <>
                Your Liquidity
                <Tooltip
                  content={content.tooltips.liquidity.replace(
                    'SWAPFEE',
                    swapFee
                  )}
                />
              </>
            }
            ocean={`${userLiquidity?.ocean}`}
            oceanSymbol={oceanSymbol}
            dt={`${userLiquidity?.datatoken}`}
            dtSymbol={dtSymbol}
            poolShares={poolTokens}
            conversion={totalUserLiquidityInOcean}
            highlight
          >
            <Token symbol="% of pool" balance={poolShare} noIcon />
          </TokenList>

          <TokenList
            title="Pool Creator Statistics"
            ocean={`${creatorLiquidity?.ocean}`}
            oceanSymbol={oceanSymbol}
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
                <Graph />
              </>
            }
            ocean={`${price?.ocean}`}
            oceanSymbol={oceanSymbol}
            dt={`${price?.datatoken}`}
            dtSymbol={dtSymbol}
            poolShares={totalPoolTokens}
            conversion={totalLiquidityInOcean}
            showTVLLabel
          >
            <Token symbol="% swap fee" balance={swapFee} noIcon />
          </TokenList>

          <div className={styles.update}>
            Fetching every {refreshInterval / 1000} sec.
          </div>

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
              <Button
                size="small"
                onClick={() => setShowRemove(true)}
                disabled={!isAssetNetwork}
              >
                Remove
              </Button>
            )}
          </div>

          {accountId && (
            <AssetActionHistoryTable title="Your Pool Transactions">
              <PoolTransactions
                poolAddress={price?.address}
                poolChainId={[ddo.chainId]}
                minimal
              />
            </AssetActionHistoryTable>
          )}
        </>
      )}
    </>
  )
}
