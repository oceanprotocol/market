import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactElement,
  useCallback,
  ReactNode
} from 'react'
import { getPoolSharesData } from '../utils/subgraph'
import { useUserPreferences } from './UserPreferences'
import { PoolShares_poolShares as PoolShare } from '../@types/apollo/PoolShares'
import { DDO, Logger } from '@oceanprotocol/lib'
import { getPublishedAssets } from '../utils/aquarius'
import { useSiteMetadata } from '../hooks/useSiteMetadata'
import { Profile } from '../models/Profile'
import { accountTruncate } from '../utils/web3'
import axios from 'axios'
import ethereumAddress from 'ethereum-address'
import get3BoxProfile from '../utils/profile'

interface ProfileProviderValue {
  profile: Profile
  poolShares: PoolShare[]
  isPoolSharesLoading: boolean
  assets: DDO[]
  assetsTotal: number
  isEthAddress: boolean
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

  const [isEthAddress, setIsEthAddress] = useState<boolean>()

  //
  // Do nothing in all following effects
  // when accountId is no ETH address
  //
  useEffect(() => {
    const isEthAddress = ethereumAddress.isAddress(accountId)
    setIsEthAddress(isEthAddress)
  }, [accountId])

  //
  // 3Box
  //
  const [profile, setProfile] = useState<Profile>({
    name: accountTruncate(accountId),
    image: null,
    description: null,
    links: null
  })

  useEffect(() => {
    const clearedProfile: Profile = {
      name: null,
      image: null,
      description: null,
      links: null
    }

    if (!accountId || !isEthAddress) {
      setProfile(clearedProfile)
      return
    }

    const source = axios.CancelToken.source()

    async function getInfoFrom3Box() {
      const profile3Box = await get3BoxProfile(accountId, source.token)
      if (profile3Box) {
        const { name, emoji, description, image, links } = profile3Box
        const newName = `${emoji || ''} ${name || accountTruncate(accountId)}`
        const newProfile = {
          name: newName,
          image,
          description,
          links
        }
        setProfile(newProfile)
      } else {
        setProfile(clearedProfile)
      }
    }
    getInfoFrom3Box()

    return () => {
      source.cancel()
    }
  }, [accountId, isEthAddress])

  //
  // POOL SHARES
  //
  const [poolShares, setPoolShares] = useState<PoolShare[]>()
  const [isPoolSharesLoading, setIsPoolSharesLoading] = useState<boolean>(false)
  const [poolSharesInterval, setPoolSharesInterval] = useState<NodeJS.Timeout>()

  const fetchPoolShares = useCallback(async () => {
    if (!accountId || !chainIds || !isEthAddress) return

    try {
      setIsPoolSharesLoading(true)
      const data = await getPoolSharesData(accountId, chainIds)
      setPoolShares(data)
    } catch (error) {
      console.error('Error fetching pool shares: ', error.message)
    } finally {
      setIsPoolSharesLoading(false)
    }
  }, [accountId, chainIds, isEthAddress])

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
  // const [assetsWithPrices, setAssetsWithPrices] = useState<AssetListPrices[]>()

  useEffect(() => {
    async function getAllPublished() {
      if (!accountId || !isEthAddress) return

      try {
        const result = await getPublishedAssets(accountId, chainIds)
        setAssets(result.results)
        setAssetsTotal(result.totalResults)

        // Hint: this would only make sense if we "search" in all subcomponents
        // against this provider's state, meaning filtering via js rather then sending
        // more queries to Aquarius.
        // const assetsWithPrices = await getAssetsBestPrices(result.results)
        // setAssetsWithPrices(assetsWithPrices)
      } catch (error) {
        Logger.error(error.message)
      }
    }
    getAllPublished()
  }, [accountId, appConfig.metadataCacheUri, chainIds, isEthAddress])

  return (
    <ProfileContext.Provider
      value={{
        profile,
        poolShares,
        isPoolSharesLoading,
        assets,
        assetsTotal,
        isEthAddress
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
