import { LoggerInstance, Pool } from '@oceanprotocol/lib'
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
import { calculateSharesVL } from '@utils/pool'
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
  const { accountId, web3, chainId } = useWeb3()
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
  // const [fetchInterval, setFetchInterval] = useState<NodeJS.Timeout>()
  const [ownerPoolShares, setOwnerPoolShares] = useState('0')
  const [userPoolShares, setUserPoolShares] = useState('0')

  const fetchAllData = useCallback(async () => {
    if (
      !accountId ||
      !asset?.chainId ||
      !asset?.accessDetails?.addressOrId ||
      !owner
    )
      return

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

  // 0 Fetch all the data on mount if we are on a pool.
  // All further effects depend on the fetched data
  // and only do further data checking and manipulation.
  //
  useEffect(() => {
    if (asset?.accessDetails?.type !== 'dynamic') return

    fetchAllData()
  }, [fetchAllData, asset?.accessDetails?.type])

  //
  // 1 General Pool Info
  //
  useEffect(() => {
    if (!poolData) return

    // once we have poolData, we need to get owner's pool shares (OVL)
    calculateSharesVL(
      poolData.id,
      poolData.baseToken.address,
      poolData.shares[0].shares,
      asset.chainId
    ).then((shares) => {
      setOwnerPoolShares(shares)
    })
    // Total Liquidity
    const totalLiquidityInOcean = new Decimal(
      poolData.baseTokenLiquidity * 2 || 0
    )

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
  }, [asset.chainId, chainId, poolData, web3])

  //
  // 2 Pool Creator Info
  //
  useEffect(() => {
    if (
      !poolData ||
      !poolInfo?.totalPoolTokens ||
      !poolInfo.totalLiquidityInOcean ||
      ownerPoolShares === '0'
    )
      return

    // Pool share tokens.
    const poolShare = new Decimal(ownerPoolShares)
      .dividedBy(poolInfo.totalLiquidityInOcean)
      .mul(100)
      .toFixed(2)

    console.log(ownerPoolShares, poolShare)

    const newPoolOwnerInfo = {
      liquidity: new Decimal(ownerPoolShares), // liquidity in base token, values from from `calcSingleOutGivenPoolIn` method
      poolShares: ownerPoolShares,
      poolShare
    }
    setPoolInfoOwner(newPoolOwnerInfo)
    LoggerInstance.log('[pool] Created new owner pool info:', newPoolOwnerInfo)
  }, [
    ownerPoolShares,
    poolData,
    poolInfo.totalLiquidityInOcean,
    poolInfo.totalPoolTokens
  ])

  //
  // 3 User Pool Info
  //
  useEffect(() => {
    if (
      !poolData ||
      !poolInfo?.totalPoolTokens ||
      !poolInfoUser?.poolShares ||
      !poolInfo?.totalLiquidityInOcean ||
      !poolData?.baseTokenLiquidity ||
      !asset?.chainId ||
      !accountId ||
      !poolInfoUser
    )
      return

    // once we have poolData, we need to get user's pool shares (VL)
    calculateSharesVL(
      poolData.id,
      poolData.baseToken.address,
      poolInfoUser.poolShares,
      asset.chainId
    ).then((shares) => {
      setUserPoolShares(shares)
    })

    // Pool share in %.
    const poolShare = new Decimal(userPoolShares)
      .dividedBy(new Decimal(poolInfo.totalLiquidityInOcean))
      .mul(100)
      .toFixed(2)

    setUserHasAddedLiquidity(Number(poolShare) > 0)

    const newPoolInfoUser = {
      liquidity: new Decimal(userPoolShares), // liquidity in base token, values from from `calcSingleOutGivenPoolIn` method
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
    userPoolShares,
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
