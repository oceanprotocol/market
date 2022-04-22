import { LoggerInstance } from '@oceanprotocol/lib'
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
import { calcSingleOutGivenPoolIn } from '@utils/pool'
import { PoolProviderValue, PoolInfo, PoolInfoUser } from './_types'
import { getFee, getPoolData, getWeight } from './_utils'
import { useMarketMetadata } from '@context/MarketMetadata'

const PoolContext = createContext({} as PoolProviderValue)

const refreshInterval = 10000 // 10 sec.

const initialPoolInfoUser: Partial<PoolInfoUser> = {
  liquidity: '0',
  poolShares: '0'
}

const initialPoolInfoCreator: Partial<PoolInfoUser> = initialPoolInfoUser

function PoolProvider({ children }: { children: ReactNode }): ReactElement {
  const { accountId, web3, chainId } = useWeb3()
  const { asset, owner } = useAsset()
  const { getOpcFeeForToken } = useMarketMetadata()
  const [poolData, setPoolData] = useState<PoolDataPoolData>()
  const [poolInfo, setPoolInfo] = useState<PoolInfo>()
  const [poolInfoOwner, setPoolInfoOwner] = useState<PoolInfoUser>(
    initialPoolInfoCreator as PoolInfoUser
  )
  const [poolInfoUser, setPoolInfoUser] = useState<PoolInfoUser>(
    initialPoolInfoUser as PoolInfoUser
  )
  const [poolSnapshots, setPoolSnapshots] = useState<PoolDataPoolSnapshots[]>()
  const [hasUserAddedLiquidity, setUserHasAddedLiquidity] = useState(false)
  // const [fetchInterval, setFetchInterval] = useState<NodeJS.Timeout>()

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

  // 0 Fetch all the data on mount if we are on a pool.
  // All further effects depend on the fetched data
  // and only do further data checking and manipulation.
  //
  useEffect(() => {
    if (asset?.accessDetails?.type !== 'dynamic') return
    fetchAllData()
    const interval = setInterval(() => {
      fetchAllData()
    }, refreshInterval)
    return () => clearInterval(interval)
  }, [fetchAllData, asset?.accessDetails?.type])

  //
  // 1 General Pool Info
  //
  useEffect(() => {
    if (!poolData) return

    const newPoolInfo = {
      liquidityProviderSwapFee: getFee(poolData.liquidityProviderSwapFee),
      publishMarketSwapFee: getFee(poolData.publishMarketSwapFee),
      opcFee: getFee(
        getOpcFeeForToken(poolData.baseToken.address, asset?.chainId)
      ),
      weightBaseToken: getWeight(poolData.baseTokenWeight),
      weightDt: getWeight(poolData.datatokenWeight),
      datatokenSymbol: poolData.datatoken.symbol,
      datatokenAddress: poolData.datatoken.address,
      baseTokenSymbol: poolData.baseToken.symbol,
      baseTokenAddress: poolData.baseToken.address,
      totalPoolTokens: poolData.totalShares
    }

    setPoolInfo(newPoolInfo)
    LoggerInstance.log('[pool] Created new pool info:', newPoolInfo)
  }, [asset?.chainId, chainId, getOpcFeeForToken, poolData, web3])

  //
  // 2 Pool Creator Info
  //
  useEffect(() => {
    if (
      !poolData ||
      !poolInfo?.totalPoolTokens ||
      poolData.shares[0]?.shares === '0'
    )
      return

    // Pool share tokens.
    const poolSharePercentage = new Decimal(poolData.shares[0]?.shares)
      .dividedBy(poolInfo.totalPoolTokens)
      .mul(100)
      .toFixed(2)

    const ownerLiquidity = calcSingleOutGivenPoolIn(
      poolData.baseTokenLiquidity,
      poolData.totalShares,
      poolData?.shares[0]?.shares
    )

    const newPoolOwnerInfo = {
      liquidity: ownerLiquidity,
      poolShares: poolData.shares[0]?.shares,
      poolSharePercentage
    }
    setPoolInfoOwner(newPoolOwnerInfo)
    LoggerInstance.log('[pool] Created new pool creatorinfo:', newPoolOwnerInfo)
  }, [
    asset?.chainId,
    poolData,
    poolInfo?.baseTokenAddress,
    poolInfo?.totalPoolTokens
  ])

  //
  // 3 User Pool Info
  //
  useEffect(() => {
    if (
      !poolData ||
      !poolInfo?.totalPoolTokens ||
      !poolInfoUser?.poolShares ||
      !poolData?.baseTokenLiquidity ||
      !asset?.chainId
    )
      return

    const userLiquidity = calcSingleOutGivenPoolIn(
      poolData.baseTokenLiquidity,
      poolData.totalShares,
      poolInfoUser.poolShares
    )

    // Pool share in %.
    const poolSharePercentage = new Decimal(poolInfoUser.poolShares)
      .dividedBy(new Decimal(poolInfo.totalPoolTokens))
      .mul(100)
      .toFixed(2)

    setUserHasAddedLiquidity(Number(poolSharePercentage) > 0)

    const newPoolInfoUser: PoolInfoUser = {
      liquidity: userLiquidity,
      poolShares: poolInfoUser.poolShares,
      poolSharePercentage
    }
    setPoolInfoUser((prevState: PoolInfoUser) => ({
      ...prevState,
      ...newPoolInfoUser
    }))

    LoggerInstance.log('[pool] Created new user pool info:', {
      ...newPoolInfoUser
    })
  }, [
    poolData,
    poolInfoUser?.poolShares,
    asset?.chainId,
    owner,
    poolInfo?.totalPoolTokens
  ])

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
