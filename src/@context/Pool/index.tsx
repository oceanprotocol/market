import { LoggerInstance } from '@oceanprotocol/lib'
import { isValidNumber } from '@utils/numbers'
import { getPoolData } from '@utils/subgraph'
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
import { getFee, getWeight } from './_utils'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

const PoolContext = createContext({} as PoolProviderValue)

const refreshInterval = 10000 // 10 sec.

const initialPoolInfo: Partial<PoolInfo> = {
  totalLiquidityInOcean: new Decimal(0)
}

const initialPoolInfoUser: Partial<PoolInfoUser> = {
  liquidity: new Decimal(0)
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
      poolShares: response.poolDataUser?.shares[0]?.shares
    }))
    setPoolSnapshots(response.poolSnapshots)
    LoggerInstance.log('[pool] Fetched pool data:', response.poolData)
    LoggerInstance.log('[pool] Fetched user data:', response.poolDataUser)
    LoggerInstance.log('[pool] Fetched pool snapshots:', response.poolSnapshots)
  }, [asset?.chainId, asset?.accessDetails?.addressOrId, owner, accountId])

  // Helper: start interval fetching
  // Having `accountId` as dependency is important for interval to
  // change after user account switch.
  const initFetchInterval = useCallback(() => {
    if (fetchInterval) return

    const newInterval = setInterval(() => {
      fetchAllData()
      LoggerInstance.log(
        `[pool] Refetch interval fired after ${refreshInterval / 1000}s`
      )
    }, refreshInterval)
    setFetchInterval(newInterval)
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

    // Fees
    const poolFee = getFee(poolData.poolFee)
    const marketFee = getFee(poolData.marketFee)
    const opfFee = getFee(poolData.opfFee)

    // Total Liquidity
    const totalLiquidityInOcean = isValidNumber(poolData.spotPrice)
      ? new Decimal(poolData.baseTokenLiquidity).add(
          new Decimal(poolData.datatokenLiquidity).mul(poolData.spotPrice)
        )
      : new Decimal(0)

    const newPoolInfo = {
      poolFee,
      marketFee,
      opfFee,
      weightBaseToken: getWeight(poolData.baseTokenWeight),
      weightDt: getWeight(poolData.datatokenWeight),
      datatokenSymbol: poolData.datatoken.symbol,
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

    const ownerPoolTokens = poolData.shares[0]?.shares

    // Liquidity in base token, calculated from pool tokens.
    // Hardcoded 50/50 pool weight so we can multiply fetched
    // poolData.baseTokenLiquidity by 2.
    const liquidity =
      isValidNumber(ownerPoolTokens) &&
      isValidNumber(poolInfo.totalPoolTokens) &&
      isValidNumber(poolData.baseTokenLiquidity)
        ? new Decimal(ownerPoolTokens)
            .dividedBy(new Decimal(poolInfo.totalPoolTokens))
            .mul(poolData.baseTokenLiquidity)
            .mul(2)
        : new Decimal(0)

    const poolShare =
      isValidNumber(ownerPoolTokens) && isValidNumber(poolInfo.totalPoolTokens)
        ? new Decimal(ownerPoolTokens)
            .dividedBy(new Decimal(poolInfo.totalPoolTokens))
            .mul(100)
            .toFixed(2)
        : '0'

    const newPoolOwnerInfo = {
      liquidity,
      poolShares: ownerPoolTokens,
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
      !asset?.chainId ||
      !accountId
    )
      return

    const poolShare =
      isValidNumber(poolInfoUser.poolShares) &&
      isValidNumber(poolInfo.totalPoolTokens) &&
      new Decimal(poolInfoUser.poolShares)
        .dividedBy(new Decimal(poolInfo.totalPoolTokens))
        .mul(100)
        .toFixed(2)

    setUserHasAddedLiquidity(Number(poolShare) > 0)

    // Liquidity in base token, calculated from pool tokens.
    // Hardcoded 50/50 pool weight so we can multiply fetched
    // poolData.baseTokenLiquidity by 2.
    const liquidity =
      isValidNumber(poolInfoUser.poolShares) &&
      isValidNumber(poolInfo.totalPoolTokens) &&
      isValidNumber(poolData.baseTokenLiquidity)
        ? new Decimal(poolInfoUser.poolShares)
            .dividedBy(new Decimal(poolInfo.totalPoolTokens))
            .mul(poolData.baseTokenLiquidity)
            .mul(2)
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
      poolShares: poolInfoUser?.poolShares,
      ...newPoolInfoUser
    })
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
