import { LoggerInstance } from '@oceanprotocol/lib'
import { isValidNumber } from '@utils/numbers'
import Decimal from 'decimal.js'
import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactElement,
  useCallback,
  ReactNode
} from 'react'
import {
  PoolData_poolSnapshots as PoolDataPoolSnapshots,
  PoolData_poolData as PoolDataPoolData
} from 'src/@types/subgraph/PoolData'
import { useAsset } from '../Asset'
import { useWeb3 } from '../Web3'
import { PoolProviderValue, PoolInfo, PoolInfoUser } from './_types'
import { getFee, getPoolData, getWeight } from './_utils'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

const PoolContext = createContext({} as PoolProviderValue)

const refreshInterval = 10000 // 10 sec.

const initialPoolInfo: Partial<PoolInfo> = {
  totalLiquidityInOcean: new Decimal(0)
}

const initialPoolInfoUser: Partial<PoolInfoUser> = {
  liquidity: new Decimal(0),
  poolShares: '0'
}

const initialPoolInfoCreator: Partial<PoolInfoUser> = initialPoolInfoUser

function PoolProvider({ children }: { children: ReactNode }): ReactElement {
  const { accountId } = useWeb3()
  const { isInPurgatory, asset, owner } = useAsset()

  const [poolData, setPoolData] = useState<PoolDataPoolData>()
  const [poolInfo, setPoolInfo] = useState<PoolInfo>(
    initialPoolInfo as PoolInfo
  )
  const [poolInfoOwner, setPoolInfoOwner] = useState<PoolInfoUser>(
    initialPoolInfoCreator as PoolInfoUser
  )
  const [poolInfoUser, setPoolInfoUser] = useState<PoolInfoUser>(
    initialPoolInfoUser as PoolInfoUser
  )
  const [poolSnapshots, setPoolSnapshots] = useState<PoolDataPoolSnapshots[]>()
  const [hasUserAddedLiquidity, setUserHasAddedLiquidity] = useState(false)
  const [isRemoveDisabled, setIsRemoveDisabled] = useState(false)
  const [fetchInterval, setFetchInterval] = useState<NodeJS.Timeout>()

  const fetchAllData = useCallback(async () => {
    if (!asset?.chainId || !asset?.accessDetails?.addressOrId || !owner) return

    const response = await getPoolData(
      asset.chainId,
      asset.accessDetails.addressOrId,
      owner,
      accountId || ''
    )
    if (!response) return

    setPoolData(response.poolData)
    setPoolInfoUser((prevState) => ({
      ...prevState,
      poolShares: response.poolDataUser?.shares[0]?.shares || '0'
    }))
    setPoolSnapshots(response.poolSnapshots)
    LoggerInstance.log('[pool] Fetched pool data:', response.poolData)
    LoggerInstance.log('[pool] Fetched user data:', response.poolDataUser)
    LoggerInstance.log('[pool] Fetched pool snapshots:', response.poolSnapshots)
  }, [asset?.chainId, asset?.accessDetails?.addressOrId, owner, accountId])

  // Helper: start interval fetching
  const initFetchInterval = useCallback(() => {
    if (fetchInterval) return

    const newInterval = setInterval(() => {
      fetchAllData()
      LoggerInstance.log(
        `[pool] Refetch interval fired after ${refreshInterval / 1000}s`
      )
    }, refreshInterval)
    setFetchInterval(newInterval)

    // Having `accountId` as dependency is important for interval to
    // change after user account switch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchInterval, fetchAllData, accountId])

  useEffect(() => {
    return () => {
      clearInterval(fetchInterval)
    }
  }, [fetchInterval])

  //
  // 0 Fetch all the data on mount if we are on a pool.
  // All further effects depend on the fetched data
  // and only do further data checking and manipulation.
  //
  useEffect(() => {
    if (asset?.accessDetails?.type !== 'dynamic') return

    fetchAllData()
    initFetchInterval()
  }, [fetchAllData, initFetchInterval, asset?.accessDetails?.type])

  //
  // 1 General Pool Info
  //
  useEffect(() => {
    if (!poolData) return

    // Total Liquidity
    const totalLiquidityInOcean = isValidNumber(poolData.spotPrice)
      ? new Decimal(poolData.baseTokenLiquidity).add(
          new Decimal(poolData.datatokenLiquidity).mul(poolData.spotPrice)
        )
      : new Decimal(0)

    const newPoolInfo = {
      liquidityProviderSwapFee: getFee(poolData.liquidityProviderSwapFee),
      publishMarketSwapFee: getFee(poolData.publishMarketSwapFee),
      opcFee: getFee(poolData.opcFee),
      weightBaseToken: getWeight(poolData.baseTokenWeight),
      weightDt: getWeight(poolData.datatokenWeight),
      datatokenSymbol: poolData.datatoken.symbol,
      datatokenAddress: poolData.datatoken.address,
      baseTokenSymbol: poolData.baseToken.symbol,
      baseTokenAddress: poolData.baseToken.address,
      totalPoolTokens: poolData.totalShares,
      totalLiquidityInOcean
    }
    setPoolInfo(newPoolInfo)
    LoggerInstance.log('[pool] Created new pool info:', newPoolInfo)
  }, [poolData])

  //
  // 2 Pool Creator Info
  //
  useEffect(() => {
    if (!poolData || !poolInfo?.totalPoolTokens) return

    // Staking bot receives half the pool shares so for display purposes
    // we can multiply by 2 as we have a hardcoded 50/50 pool weight.
    const ownerPoolShares = new Decimal(poolData.shares[0]?.shares)
      .mul(2)
      .toString()

    // Liquidity in base token, calculated from pool share tokens.
    const liquidity =
      isValidNumber(ownerPoolShares) &&
      isValidNumber(poolInfo.totalPoolTokens) &&
      isValidNumber(poolData.baseTokenLiquidity)
        ? new Decimal(ownerPoolShares)
            .dividedBy(new Decimal(poolInfo.totalPoolTokens))
            .mul(poolData.baseTokenLiquidity)
        : new Decimal(0)

    // Pool share tokens.
    const poolShare =
      isValidNumber(ownerPoolShares) && isValidNumber(poolInfo.totalPoolTokens)
        ? new Decimal(ownerPoolShares)
            .dividedBy(new Decimal(poolInfo.totalPoolTokens))
            .mul(100)
            .toFixed(2)
        : '0'

    const newPoolOwnerInfo = {
      liquidity,
      poolShares: ownerPoolShares,
      poolShare
    }
    setPoolInfoOwner(newPoolOwnerInfo)
    LoggerInstance.log('[pool] Created new owner pool info:', newPoolOwnerInfo)
  }, [poolData, poolInfo?.totalPoolTokens])

  //
  // 3 User Pool Info
  //
  useEffect(() => {
    if (
      !poolData ||
      !poolInfo?.totalPoolTokens ||
      !poolInfoUser?.poolShares ||
      !asset?.chainId ||
      !accountId ||
      !poolInfoUser
    )
      return
    // Staking bot receives half the pool shares so for display purposes
    // we can multiply by 2 as we have a hardcoded 50/50 pool weight.
    const userPoolShares = new Decimal(poolInfoUser.poolShares || 0)
      .mul(2)
      .toString()

    // Pool share in %.
    const poolShare =
      isValidNumber(userPoolShares) &&
      isValidNumber(poolInfo.totalPoolTokens) &&
      new Decimal(userPoolShares)
        .dividedBy(new Decimal(poolInfo.totalPoolTokens))
        .mul(100)
        .toFixed(2)

    setUserHasAddedLiquidity(Number(poolShare) > 0)

    // Liquidity in base token, calculated from pool share tokens.
    const liquidity =
      isValidNumber(userPoolShares) &&
      isValidNumber(poolInfo.totalPoolTokens) &&
      isValidNumber(poolData.baseTokenLiquidity)
        ? new Decimal(userPoolShares)
            .dividedBy(new Decimal(poolInfo.totalPoolTokens))
            .mul(poolData.baseTokenLiquidity)
        : new Decimal(0)

    const newPoolInfoUser = {
      liquidity,
      poolShare
    }
    setPoolInfoUser((prevState: PoolInfoUser) => ({
      ...prevState,
      ...newPoolInfoUser
    }))

    LoggerInstance.log('[pool] Created new user pool info:', {
      poolShares: userPoolShares,
      ...newPoolInfoUser
    })
    // poolInfoUser was not added on purpose, we use setPoolInfoUser so it will just loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    poolData,
    poolInfoUser?.poolShares,
    accountId,
    asset?.chainId,
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
    <PoolContext.Provider
      value={
        {
          poolData,
          poolInfo,
          poolInfoOwner,
          poolInfoUser,
          poolSnapshots,
          hasUserAddedLiquidity,
          isRemoveDisabled,
          refreshInterval,
          fetchAllData
        } as PoolProviderValue
      }
    >
      {children}
    </PoolContext.Provider>
  )
}

// Helper hook to access the provider values
const usePool = (): PoolProviderValue => useContext(PoolContext)

export { PoolProvider, usePool, PoolContext }
export default PoolProvider
