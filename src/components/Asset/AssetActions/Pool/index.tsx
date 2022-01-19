import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { LoggerInstance } from '@oceanprotocol/lib'
import styles from './index.module.css'
import stylesActions from './Actions.module.css'
import PriceUnit from '@shared/Price/PriceUnit'
import Button from '@shared/atoms/Button'
import Add from './Add'
import Remove from './Remove'
import Tooltip from '@shared/atoms/Tooltip'
import ExplorerLink from '@shared/ExplorerLink'
import Token from './Token'
import TokenList from './TokenList'
import AssetActionHistoryTable from '../AssetActionHistoryTable'
import Graph from './Graph'
import { useAsset } from '@context/Asset'
import { gql, OperationResult } from 'urql'
import {
  PoolLiquidity,
  PoolLiquidity_pool as PoolLiquidityData
} from '../../../../@types/subgraph/PoolLiquidity'
import { useWeb3 } from '@context/Web3'
import PoolTransactions from '@shared/PoolTransactions'
import { fetchData, getQueryContext } from '@utils/subgraph'
import { isValidNumber } from '@utils/numbers'
import Decimal from 'decimal.js'
import content from '../../../../../content/price.json'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

const poolLiquidityQuery = gql`
  query PoolLiquidity($pool: ID!, $owner: String) {
    pool(id: $pool) {
      id
      totalShares
      poolFee
      opfFee
      marketFee
      spotPrice
      baseToken {
        address
        symbol
      }
      baseTokenWeight
      baseTokenLiquidity
      datatoken {
        address
        symbol
      }
      datatokenWeight
      datatokenLiquidity
      shares(where: { user: $owner }) {
        shares
      }
    }
  }
`

const userPoolShareQuery = gql`
  query PoolShare($pool: ID!, $user: String) {
    pool(id: $pool) {
      id
      shares(where: { user: $user }) {
        shares
      }
    }
  }
`

async function getPoolData(chainId: number, pool: string, owner: string) {
  const queryVariables = {
    pool: pool.toLowerCase(),
    owner: owner.toLowerCase()
  }
  const response: OperationResult<PoolLiquidity> = await fetchData(
    poolLiquidityQuery,
    queryVariables,
    getQueryContext(chainId)
  )
  return response?.data.pool
}

async function getUserPoolShareBalance(
  chainId: number,
  pool: string,
  accountId: string
): Promise<string> {
  const queryVariables = {
    pool: pool.toLowerCase(),
    user: accountId.toLowerCase()
  }
  const response: OperationResult<PoolLiquidity> = await fetchData(
    userPoolShareQuery,
    queryVariables,
    getQueryContext(chainId)
  )
  return response?.data.pool.shares[0]?.shares || '0'
}

function getWeight(weight: string) {
  return isValidNumber(weight) ? new Decimal(weight).mul(10).toString() : '0'
}

export default function Pool(): ReactElement {
  const { accountId } = useWeb3()
  const { isInPurgatory, ddo, owner, price, refreshInterval, isAssetNetwork } =
    useAsset()

  const [poolData, setPoolData] = useState<PoolLiquidityData>()
  const [poolFee, setPoolFee] = useState<string>()
  const [weightOcean, setWeightOcean] = useState<string>()
  const [weightDt, setWeightDt] = useState<string>()
  const [dtSymbol, setDtSymbol] = useState<string>()
  const [oceanSymbol, setOceanSymbol] = useState<string>()
  const [totalPoolTokens, setTotalPoolTokens] = useState<string>()

  const [userShares, setUserShares] = useState<string>()
  const [userLiquidity, setUserLiquidity] = useState<PoolBalance>()
  const [hasAddedLiquidity, setHasAddedLiquidity] = useState(false)
  const [poolShare, setPoolShare] = useState<string>()
  const [userLiquidityInOcean, setUserLiquidityInOcean] = useState(
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

  const [showAdd, setShowAdd] = useState(false)
  const [showRemove, setShowRemove] = useState(false)
  const [isRemoveDisabled, setIsRemoveDisabled] = useState(false)
  const [fetchInterval, setFetchInterval] = useState<NodeJS.Timeout>()

  // This returns totalPoolTokens, among other things.
  // Calling this method will trigger all other effects in case
  // totalPoolTokens changes.
  const fetchPoolData = useCallback(async () => {
    if (!ddo?.chainId || !price?.address || !owner) return

    const poolData = await getPoolData(ddo.chainId, price.address, owner)
    setPoolData(poolData)
    LoggerInstance.log('[pool] Fetched pool data:', poolData)
  }, [ddo?.chainId, price?.address, owner])

  const fetchUserShares = useCallback(async () => {
    if (!ddo?.chainId || !price?.address || !accountId) return

    const userShares = await getUserPoolShareBalance(
      ddo.chainId,
      price.address,
      accountId
    )
    setUserShares(userShares)
    LoggerInstance.log(`[pool] Fetched user shares: ${userShares}`)
  }, [ddo?.chainId, price?.address, accountId])

  // Helper to fetch everything
  const refreshAllLiquidity = useCallback(() => {
    fetchPoolData()
    fetchUserShares()
  }, [fetchPoolData, fetchUserShares])

  const initFetchInterval = useCallback(() => {
    if (fetchInterval) return

    const newInterval = setInterval(() => {
      fetchPoolData()
      fetchUserShares()
      LoggerInstance.log(
        `[pool] Refetch interval fired after ${refreshInterval / 1000}s`
      )
    }, refreshInterval)
    setFetchInterval(newInterval)
  }, [fetchInterval, fetchPoolData, fetchUserShares, refreshInterval])

  useEffect(() => {
    return () => {
      clearInterval(fetchInterval)
    }
  }, [fetchInterval])

  //
  // 0 Fetch all the data
  // All further effects depend on the fetched data
  // and only do further data checking and manipulation.
  //
  useEffect(() => {
    refreshAllLiquidity()
    initFetchInterval()
  }, [refreshAllLiquidity, initFetchInterval])

  //
  // 1 General Pool Info
  //
  useEffect(() => {
    if (!poolData || !price?.ocean || !price?.datatoken) return

    // Set symbols
    setOceanSymbol(poolData.baseToken.symbol)
    setDtSymbol(poolData.datatoken.symbol)

    // Total pool shares
    setTotalPoolTokens(poolData.totalShares)

    // Pool Fee (swap fee)
    // poolFee is tricky: to get 0.1% you need to convert from 0.001
    const poolFee = isValidNumber(poolData.poolFee)
      ? new Decimal(poolData.poolFee).mul(100).toString()
      : '0'
    setPoolFee(poolFee)

    // Get weights
    const weightDtDecimal = getWeight(poolData.datatokenWeight)
    const weightOceanDecimal = getWeight(poolData.baseTokenWeight)
    setWeightDt(weightDtDecimal)
    setWeightOcean(weightOceanDecimal)

    // Total Liquidity
    const totalLiquidityInOcean =
      isValidNumber(price.ocean) &&
      isValidNumber(price.datatoken) &&
      isValidNumber(poolData.spotPrice)
        ? new Decimal(price.ocean).add(
            new Decimal(price.datatoken).mul(poolData.spotPrice)
          )
        : new Decimal(0)

    setTotalLiquidityInOcean(totalLiquidityInOcean)
  }, [poolData, totalPoolTokens, price?.datatoken, price?.ocean])

  //
  // 2 Pool Creator Info
  //
  useEffect(() => {
    if (!poolData || !price?.ocean || !price?.datatoken) return

    const creatorPoolTokens = poolData.shares[0]?.shares
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
      isValidNumber(poolData.spotPrice)
        ? new Decimal(creatorLiquidity?.ocean).add(
            new Decimal(creatorLiquidity?.datatoken).mul(
              new Decimal(poolData.spotPrice)
            )
          )
        : new Decimal(0)

    setCreatorTotalLiquidityInOcean(totalCreatorLiquidityInOcean)

    const creatorPoolShare =
      creatorLiquidity &&
      isValidNumber(creatorPoolTokens) &&
      isValidNumber(totalPoolTokens)
        ? new Decimal(creatorPoolTokens)
            .dividedBy(new Decimal(totalPoolTokens))
            .mul(100)
            .toFixed(2)
        : '0'

    setCreatorPoolShare(creatorPoolShare)
  }, [poolData, price?.ocean, price?.datatoken, totalPoolTokens])

  //
  // 3 User Pool Info
  //
  useEffect(() => {
    if (
      !poolData?.spotPrice ||
      !ddo?.chainId ||
      !accountId ||
      !price?.ocean ||
      !price?.datatoken
    )
      return

    const poolShare =
      isValidNumber(userShares) &&
      isValidNumber(totalPoolTokens) &&
      new Decimal(userShares)
        .dividedBy(new Decimal(totalPoolTokens))
        .mul(100)
        .toFixed(5)

    setPoolShare(poolShare)
    setHasAddedLiquidity(Number(poolShare) > 0)

    // calculate user's provided liquidity based on pool tokens
    const userOceanBalance =
      isValidNumber(userShares) &&
      isValidNumber(totalPoolTokens) &&
      isValidNumber(price.ocean)
        ? new Decimal(userShares)
            .dividedBy(new Decimal(totalPoolTokens))
            .mul(price.ocean)
            .toString()
        : '0'

    const userDtBalance =
      isValidNumber(userShares) &&
      isValidNumber(totalPoolTokens) &&
      isValidNumber(price.datatoken)
        ? new Decimal(userShares)
            .dividedBy(new Decimal(totalPoolTokens))
            .mul(price.datatoken)
            .toString()
        : '0'

    const userLiquidity = {
      ocean: userOceanBalance,
      datatoken: userDtBalance
    }
    setUserLiquidity(userLiquidity)

    const userLiquidityInOcean =
      isValidNumber(userLiquidity.ocean) &&
      isValidNumber(userLiquidity.datatoken) &&
      isValidNumber(poolData.spotPrice)
        ? new Decimal(userLiquidity.ocean).add(
            new Decimal(userLiquidity.datatoken).mul(poolData.spotPrice)
          )
        : new Decimal(0)

    setUserLiquidityInOcean(userLiquidityInOcean)
  }, [
    poolData?.spotPrice,
    userShares,
    accountId,
    price,
    ddo?.chainId,
    owner,
    totalPoolTokens
  ])

  //
  // Check if removing liquidity should be disabled.
  //
  useEffect(() => {
    if (!owner || !accountId) return

    setIsRemoveDisabled(isInPurgatory && owner === accountId)
  }, [isInPurgatory, owner, accountId])

  return (
    <>
      {showAdd ? (
        <Add
          setShowAdd={setShowAdd}
          poolAddress={price?.address}
          totalPoolTokens={totalPoolTokens}
          totalBalance={{
            ocean: new Decimal(price?.ocean).toString(),
            datatoken: new Decimal(price?.datatoken).toString()
          }}
          swapFee={poolFee}
          dtSymbol={dtSymbol}
          dtAddress={ddo?.services[0].datatokenAddress}
          refreshAllLiquidity={refreshAllLiquidity}
        />
      ) : showRemove ? (
        <Remove
          setShowRemove={setShowRemove}
          poolAddress={price?.address}
          poolTokens={userShares}
          totalPoolTokens={totalPoolTokens}
          dtSymbol={dtSymbol}
          refreshAllLiquidity={refreshAllLiquidity}
        />
      ) : (
        <>
          <div className={styles.dataToken}>
            <PriceUnit price="1" symbol={dtSymbol} /> ={' '}
            <PriceUnit price={`${price?.value}`} symbol={oceanSymbol} />
            <Tooltip content={content.pool.tooltips.price} />
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
                    ? `tokens/${ddo.services[0].datatokenAddress}`
                    : `token/${ddo.services[0].datatokenAddress}`
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
                  content={content.pool.tooltips.liquidity.replace(
                    'SWAPFEE',
                    poolFee
                  )}
                />
              </>
            }
            ocean={`${userLiquidity?.ocean}`}
            oceanSymbol={oceanSymbol}
            dt={`${userLiquidity?.datatoken}`}
            dtSymbol={dtSymbol}
            poolShares={userShares}
            conversion={userLiquidityInOcean}
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
            <Token symbol="% pool fee" balance={poolFee} noIcon />
          </TokenList>

          <div className={styles.update}>
            Fetching every {refreshInterval / 1000} sec.
          </div>

          <div className={stylesActions.actions}>
            <Button
              style="primary"
              size="small"
              onClick={() => setShowAdd(true)}
              disabled={isInPurgatory}
            >
              Add Liquidity
            </Button>

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
                accountId={accountId}
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
