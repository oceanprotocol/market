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
  AssetListPrices,
  getAssetsBestPrices,
  getPoolSharesData
} from '../utils/subgraph'
import { useUserPreferences } from './UserPreferences'
import { PoolShares_poolShares as PoolShare } from '../@types/apollo/PoolShares'
import { DDO, Logger } from '@oceanprotocol/lib'
import { getPublishedAssets } from '../utils/aquarius'
import { useSiteMetadata } from '../hooks/useSiteMetadata'

interface ProfileProviderValue {
  poolShares: PoolShare[]
  isPoolSharesLoading: boolean
  assets: DDO[]
  assetsTotal: number
}

const ProfileContext = createContext({} as ProfileProviderValue)

const refreshInterval = 10000 // 10 sec.

function ProfileProvider({
  accountId,
  children
}: {
  accountId: string
  children: ReactNode
}): ReactElement {
  const { chainIds } = useUserPreferences()
  const { appConfig } = useSiteMetadata()

  //
  // POOL SHARES
  //
  const [poolShares, setPoolShares] = useState<PoolShare[]>()
  const [isPoolSharesLoading, setIsPoolSharesLoading] = useState<boolean>(false)
  const [poolSharesInterval, setPoolSharesInterval] = useState<NodeJS.Timeout>()

  const fetchPoolShares = useCallback(async () => {
    if (!accountId || !chainIds) return

    try {
      setIsPoolSharesLoading(true)
      const data = await getPoolSharesData(accountId, chainIds)
      setPoolShares(data)
    } catch (error) {
      console.error('Error fetching pool shares: ', error.message)
    } finally {
      setIsPoolSharesLoading(false)
    }
  }, [accountId, chainIds])

  useEffect(() => {
    async function init() {
      await fetchPoolShares()

      if (poolSharesInterval) return
      const interval = setInterval(async () => {
        await fetchPoolShares()
      }, refreshInterval)
      setPoolSharesInterval(interval)
    }
    init()

    return () => {
      clearInterval(poolSharesInterval)
    }
  }, [poolSharesInterval, fetchPoolShares])

  //
  // PUBLISHED ASSETS
  //
  const [assets, setAssets] = useState<DDO[]>()
  const [assetsTotal, setAssetsTotal] = useState(0)

  useEffect(() => {
    async function getAllPublished() {
      if (!accountId) return

      try {
        const result = await getPublishedAssets(accountId, chainIds)
        setAssets(result.results)
        setAssetsTotal(result.totalResults)
      } catch (error) {
        Logger.error(error.message)
      }
    }
    getAllPublished()
  }, [accountId, appConfig.metadataCacheUri, chainIds])

  return (
    <ProfileContext.Provider
      value={{
        poolShares,
        isPoolSharesLoading,
        assets,
        assetsTotal
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

// Helper hook to access the provider values
const useProfile = (): ProfileProviderValue => useContext(ProfileContext)

export { ProfileProvider, useProfile, ProfileProviderValue, ProfileContext }
export default ProfileProvider
