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
import { PoolLiquidity_pool as PoolLiquidityData } from '../../../../@types/subgraph/PoolLiquidity'
import { useWeb3 } from '@context/Web3'
import PoolTransactions from '@shared/PoolTransactions'
import { isValidNumber } from '@utils/numbers'
import Decimal from 'decimal.js'
import content from '../../../../../content/price.json'
import { getPoolData, getUserPoolShareBalance } from '@utils/subgraph'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

function getWeight(weight: string) {
  return isValidNumber(weight) ? new Decimal(weight).mul(10).toString() : '0'
}

interface PoolInfo {
  poolFee: string
  weightOcean: string
  weightDt: string
  dtSymbol: string
  oceanSymbol: string
  totalPoolTokens: string
  totalLiquidityInOcean: Decimal
}

interface PoolInfoUser {
  totalLiquidityInOcean: Decimal
  liquidity: PoolBalance
  poolShares: string
  poolShare: string // in %
}

const initialPoolInfo: Partial<PoolInfo> = {
  totalLiquidityInOcean: new Decimal(0)
}

const initialPoolInfoUser: Partial<PoolInfoUser> = {
  totalLiquidityInOcean: new Decimal(0)
}

const initialPoolInfoCreator: Partial<PoolInfoUser> = initialPoolInfoUser

export default function Pool(): ReactElement {
  const { accountId } = useWeb3()
  const { isInPurgatory, ddo, owner, price, refreshInterval, isAssetNetwork } =
    useAsset()

  const [poolData, setPoolData] = useState<PoolLiquidityData>()
  const [poolInfo, setPoolInfo] = useState<PoolInfo>(
    initialPoolInfo as PoolInfo
  )
  const [poolInfoOwner, setPoolInfoOwner] = useState<PoolInfoUser>(
    initialPoolInfoCreator as PoolInfoUser
  )
  const [poolInfoUser, setPoolInfoUser] = useState<PoolInfoUser>(
    initialPoolInfoUser as PoolInfoUser
  )

  const [hasUserAddedLiquidity, setUserHasAddedLiquidity] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [showRemove, setShowRemove] = useState(false)
  const [isRemoveDisabled, setIsRemoveDisabled] = useState(false)
  const [fetchInterval, setFetchInterval] = useState<NodeJS.Timeout>()

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
    setPoolInfoUser((prevState) => ({
      ...prevState,
      poolShares: userShares
    }))
    LoggerInstance.log(`[pool] Fetched user shares: ${userShares}`)
  }, [ddo?.chainId, price?.address, accountId])

  // Helper: fetch everything
  const refreshAllLiquidity = useCallback(() => {
    fetchPoolData()
    fetchUserShares()
  }, [fetchPoolData, fetchUserShares])

  // Helper: start interval fetching
  const initFetchInterval = useCallback(() => {
    if (fetchInterval) return

    const newInterval = setInterval(() => {
      refreshAllLiquidity()
      LoggerInstance.log(
        `[pool] Refetch interval fired after ${refreshInterval / 1000}s`
      )
    }, refreshInterval)
    setFetchInterval(newInterval)
  }, [fetchInterval, refreshAllLiquidity, refreshInterval])

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

    // Pool Fee (swap fee)
    // poolFee is tricky: to get 0.1% you need to convert from 0.001
    const poolFee = isValidNumber(poolData.poolFee)
      ? new Decimal(poolData.poolFee).mul(100).toString()
      : '0'

    // Total Liquidity
    const totalLiquidityInOcean =
      isValidNumber(price.ocean) &&
      isValidNumber(price.datatoken) &&
      isValidNumber(poolData.spotPrice)
        ? new Decimal(price.ocean).add(
            new Decimal(price.datatoken).mul(poolData.spotPrice)
          )
        : new Decimal(0)

    const newPoolInfo = {
      poolFee,
      weightOcean: getWeight(poolData.baseTokenWeight),
      weightDt: getWeight(poolData.datatokenWeight),
      dtSymbol: poolData.datatoken.symbol,
      oceanSymbol: poolData.baseToken.symbol,
      totalPoolTokens: poolData.totalShares,
      totalLiquidityInOcean
    }
    setPoolInfo(newPoolInfo)
    LoggerInstance.log('[pool] Created new pool info:', newPoolInfo)
  }, [poolData, price?.datatoken, price?.ocean])

  //
  // 2 Pool Creator Info
  //
  useEffect(() => {
    if (
      !poolData ||
      !poolInfo?.totalPoolTokens ||
      !price?.ocean ||
      !price?.datatoken
    )
      return

    const ownerPoolTokens = poolData.shares[0]?.shares

    const ownerOceanBalance =
      isValidNumber(ownerPoolTokens) &&
      isValidNumber(poolInfo.totalPoolTokens) &&
      isValidNumber(price.ocean)
        ? new Decimal(ownerPoolTokens)
            .dividedBy(new Decimal(poolInfo.totalPoolTokens))
            .mul(price.ocean)
            .toString()
        : '0'

    const ownerDtBalance =
      isValidNumber(ownerPoolTokens) &&
      isValidNumber(poolInfo.totalPoolTokens) &&
      isValidNumber(price.datatoken)
        ? new Decimal(ownerPoolTokens)
            .dividedBy(new Decimal(poolInfo.totalPoolTokens))
            .mul(price.datatoken)
            .toString()
        : '0'

    const liquidity = {
      ocean: ownerOceanBalance,
      datatoken: ownerDtBalance
    }

    const totalLiquidityInOcean =
      isValidNumber(liquidity.ocean) &&
      isValidNumber(liquidity.datatoken) &&
      isValidNumber(poolData.spotPrice)
        ? new Decimal(liquidity.ocean).add(
            new Decimal(liquidity.datatoken).mul(
              new Decimal(poolData.spotPrice)
            )
          )
        : new Decimal(0)

    const poolShare =
      liquidity &&
      isValidNumber(ownerPoolTokens) &&
      isValidNumber(poolInfo.totalPoolTokens)
        ? new Decimal(ownerPoolTokens)
            .dividedBy(new Decimal(poolInfo.totalPoolTokens))
            .mul(100)
            .toFixed(2)
        : '0'

    const newPoolOwnerInfo = {
      totalLiquidityInOcean,
      liquidity,
      poolShares: ownerPoolTokens,
      poolShare
    }
    setPoolInfoOwner(newPoolOwnerInfo)
    LoggerInstance.log('[pool] Created new owner pool info:', newPoolOwnerInfo)
  }, [poolData, price?.ocean, price?.datatoken, poolInfo?.totalPoolTokens])

  //
  // 3 User Pool Info
  //
  useEffect(() => {
    if (
      !poolData?.spotPrice ||
      !poolInfo?.totalPoolTokens ||
      !ddo?.chainId ||
      !accountId ||
      !price?.ocean ||
      !price?.datatoken
    )
      return

    const poolShare =
      isValidNumber(poolInfoUser.poolShares) &&
      isValidNumber(poolInfo.totalPoolTokens) &&
      new Decimal(poolInfoUser.poolShares)
        .dividedBy(new Decimal(poolInfo.totalPoolTokens))
        .mul(100)
        .toFixed(5)

    setUserHasAddedLiquidity(Number(poolShare) > 0)

    // calculate user's provided liquidity based on pool tokens
    const userOceanBalance =
      isValidNumber(poolInfoUser.poolShares) &&
      isValidNumber(poolInfo.totalPoolTokens) &&
      isValidNumber(price.ocean)
        ? new Decimal(poolInfoUser.poolShares)
            .dividedBy(new Decimal(poolInfo.totalPoolTokens))
            .mul(price.ocean)
            .toString()
        : '0'

    const userDtBalance =
      isValidNumber(poolInfoUser.poolShares) &&
      isValidNumber(poolInfo.totalPoolTokens) &&
      isValidNumber(price.datatoken)
        ? new Decimal(poolInfoUser.poolShares)
            .dividedBy(new Decimal(poolInfo.totalPoolTokens))
            .mul(price.datatoken)
            .toString()
        : '0'

    const liquidity = {
      ocean: userOceanBalance,
      datatoken: userDtBalance
    }

    const totalLiquidityInOcean =
      isValidNumber(liquidity.ocean) &&
      isValidNumber(liquidity.datatoken) &&
      isValidNumber(poolData.spotPrice)
        ? new Decimal(liquidity.ocean).add(
            new Decimal(liquidity.datatoken).mul(poolData.spotPrice)
          )
        : new Decimal(0)

    const newPoolInfoUser = {
      totalLiquidityInOcean,
      liquidity,
      poolShare
    }
    setPoolInfoUser((prevState: PoolInfoUser) => ({
      ...prevState,
      ...newPoolInfoUser
    }))

    LoggerInstance.log('[pool] Created new user pool info:', {
      poolShares: poolInfoUser?.poolShares,
      ...newPoolInfoUser
    })
  }, [
    poolData?.spotPrice,
    poolInfoUser?.poolShares,
    accountId,
    price,
    ddo?.chainId,
    owner,
    poolInfo?.totalPoolTokens
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
          totalPoolTokens={poolInfo.totalPoolTokens}
          totalBalance={{
            ocean: new Decimal(price?.ocean).toString(),
            datatoken: new Decimal(price?.datatoken).toString()
          }}
          swapFee={poolInfo.poolFee}
          dtSymbol={poolInfo.dtSymbol}
          dtAddress={ddo?.services[0].datatokenAddress}
          refreshAllLiquidity={refreshAllLiquidity}
        />
      ) : showRemove ? (
        <Remove
          setShowRemove={setShowRemove}
          poolAddress={price?.address}
          poolTokens={poolInfoUser.poolShares}
          totalPoolTokens={poolInfo?.totalPoolTokens}
          dtSymbol={poolInfo?.dtSymbol}
          refreshAllLiquidity={refreshAllLiquidity}
        />
      ) : (
        <>
          <div className={styles.dataToken}>
            <PriceUnit price="1" symbol={poolInfo?.dtSymbol} /> ={' '}
            <PriceUnit
              price={`${price?.value}`}
              symbol={poolInfo?.oceanSymbol}
            />
            <Tooltip content={content.pool.tooltips.price} />
            <div className={styles.dataTokenLinks}>
              <ExplorerLink
                networkId={ddo?.chainId}
                path={`address/${price?.address}`}
              >
                Pool
              </ExplorerLink>
              <ExplorerLink
                networkId={ddo?.chainId}
                path={
                  ddo?.chainId === 2021000 || ddo?.chainId === 1287
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
                    poolInfo?.poolFee
                  )}
                />
              </>
            }
            ocean={`${poolInfoUser?.liquidity?.ocean}`}
            oceanSymbol={poolInfo?.oceanSymbol}
            dt={`${poolInfoUser?.liquidity?.datatoken}`}
            dtSymbol={poolInfo?.dtSymbol}
            poolShares={poolInfoUser?.poolShares}
            conversion={poolInfoUser?.totalLiquidityInOcean}
            highlight
          >
            <Token
              symbol="% of pool"
              balance={poolInfoUser?.poolShare}
              noIcon
            />
          </TokenList>

          <TokenList
            title="Pool Creator Statistics"
            ocean={`${poolInfoOwner?.liquidity?.ocean}`}
            oceanSymbol={poolInfo?.oceanSymbol}
            dt={`${poolInfoOwner?.liquidity?.datatoken}`}
            dtSymbol={poolInfo?.dtSymbol}
            poolShares={poolInfoOwner?.poolShares}
            conversion={poolInfoOwner?.totalLiquidityInOcean}
          >
            <Token
              symbol="% of pool"
              balance={poolInfoOwner?.poolShare}
              noIcon
            />
          </TokenList>

          <TokenList
            title={
              <>
                Pool Statistics
                {poolInfo?.weightDt && (
                  <span
                    className={styles.titleInfo}
                    title={`Weight of ${poolInfo?.weightOcean}% OCEAN & ${poolInfo?.weightDt}% ${poolInfo?.dtSymbol}`}
                  >
                    {poolInfo?.weightOcean}/{poolInfo?.weightDt}
                  </span>
                )}
                <Graph />
              </>
            }
            ocean={`${price?.ocean}`}
            oceanSymbol={poolInfo?.oceanSymbol}
            dt={`${price?.datatoken}`}
            dtSymbol={poolInfo?.dtSymbol}
            poolShares={poolInfo?.totalPoolTokens}
            conversion={poolInfo?.totalLiquidityInOcean}
            showTVLLabel
          >
            <Token symbol="% pool fee" balance={poolInfo?.poolFee} noIcon />
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

            {hasUserAddedLiquidity && !isRemoveDisabled && (
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
                poolChainId={[ddo?.chainId]}
                minimal
              />
            </AssetActionHistoryTable>
          )}
        </>
      )}
    </>
  )
}
