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
  getPoolSharesData,
  getUserSales,
  getUserTokenOrders
} from '@utils/subgraph'
import { useUserPreferences } from './UserPreferences'
import { PoolShares_poolShares as PoolShare } from '../@types/apollo/PoolShares'
import { DDO, Logger } from '@oceanprotocol/lib'
import { getDownloadAssets, getPublishedAssets } from '@utils/aquarius'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import { accountTruncate } from '@utils/web3'
import axios, { CancelToken } from 'axios'
import ethereumAddress from 'ethereum-address'
import get3BoxProfile from '@utils/profile'
import web3 from 'web3'

interface ProfileProviderValue {
  profile: Profile
  poolShares: PoolShare[]
  isPoolSharesLoading: boolean
  assets: DDO[]
  assetsTotal: number
  isEthAddress: boolean
  downloads: DownloadedAsset[]
  downloadsTotal: number
  isDownloadsLoading: boolean
  sales: number
}

const ProfileContext = createContext({} as ProfileProviderValue)

const refreshInterval = 10000 // 10 sec.

function ProfileProvider({
  accountId,
  accountEns,
  children
}: {
  accountId: string
  accountEns: string
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
  // User profile: ENS + 3Box
  //
  const [profile, setProfile] = useState<Profile>()

  useEffect(() => {
    if (!accountEns) return
    Logger.log(`[profile] ENS name found for ${accountId}:`, accountEns)
  }, [accountId, accountEns])

  useEffect(() => {
    const clearedProfile: Profile = {
      name: null,
      accountEns: null,
      image: null,
      description: null,
      links: null
    }

    if (!accountId || !isEthAddress) {
      setProfile(clearedProfile)
      return
    }

    const cancelTokenSource = axios.CancelToken.source()

    async function getInfo() {
      setProfile({ name: accountEns || accountTruncate(accountId), accountEns })

      const profile3Box = await get3BoxProfile(
        accountId,
        cancelTokenSource.token
      )
      if (profile3Box) {
        const { name, emoji, description, image, links } = profile3Box
        const newName = `${emoji || ''} ${name || accountTruncate(accountId)}`
        const newProfile = {
          name: newName,
          image,
          description,
          links
        }
        setProfile((prevState) => ({
          ...prevState,
          ...newProfile
        }))
        Logger.log('[profile] Found and set 3box profile.', newProfile)
      } else {
        // setProfile(clearedProfile)
        Logger.log('[profile] No 3box profile found.')
      }
    }
    getInfo()

    return () => {
      cancelTokenSource.cancel()
    }
  }, [accountId, accountEns, isEthAddress])

  //
  // POOL SHARES
  //
  const [poolShares, setPoolShares] = useState<PoolShare[]>()
  const [isPoolSharesLoading, setIsPoolSharesLoading] = useState<boolean>(false)
  const [poolSharesInterval, setPoolSharesInterval] = useState<NodeJS.Timeout>()

  const fetchPoolShares = useCallback(
    async (accountId, chainIds, isEthAddress) => {
      if (!accountId || !chainIds || !isEthAddress) return

      try {
        setIsPoolSharesLoading(true)
        const poolShares = await getPoolSharesData(accountId, chainIds)
        setPoolShares(poolShares)
        Logger.log(
          `[profile] Fetched ${poolShares.length} pool shares.`,
          poolShares
        )
      } catch (error) {
        Logger.error('Error fetching pool shares: ', error.message)
      } finally {
        setIsPoolSharesLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    async function init() {
      await fetchPoolShares(accountId, chainIds, isEthAddress)

      if (poolSharesInterval) return
      const interval = setInterval(async () => {
        await fetchPoolShares(accountId, chainIds, isEthAddress)
      }, refreshInterval)
      setPoolSharesInterval(interval)
    }
    init()

    return () => {
      clearInterval(poolSharesInterval)
    }
  }, [poolSharesInterval, fetchPoolShares, accountId, chainIds, isEthAddress])

  //
  // PUBLISHED ASSETS
  //
  const [assets, setAssets] = useState<DDO[]>()
  const [assetsTotal, setAssetsTotal] = useState(0)
  // const [assetsWithPrices, setAssetsWithPrices] = useState<AssetListPrices[]>()

  useEffect(() => {
    if (!accountId || !isEthAddress) return

    const cancelTokenSource = axios.CancelToken.source()

    async function getAllPublished() {
      try {
        const result = await getPublishedAssets(
          accountId,
          chainIds,
          cancelTokenSource.token
        )
        setAssets(result.results)
        setAssetsTotal(result.totalResults)
        Logger.log(
          `[profile] Fetched ${result.totalResults} assets.`,
          result.results
        )

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

    return () => {
      cancelTokenSource.cancel()
    }
  }, [accountId, appConfig.metadataCacheUri, chainIds, isEthAddress])

  //
  // DOWNLOADS
  //
  const [downloads, setDownloads] = useState<DownloadedAsset[]>()
  const [downloadsTotal, setDownloadsTotal] = useState(0)
  const [isDownloadsLoading, setIsDownloadsLoading] = useState<boolean>()
  const [downloadsInterval, setDownloadsInterval] = useState<NodeJS.Timeout>()

  const fetchDownloads = useCallback(
    async (cancelToken: CancelToken) => {
      if (!accountId || !chainIds) return

      const didList: string[] = []
      const tokenOrders = await getUserTokenOrders(accountId, chainIds)

      for (let i = 0; i < tokenOrders?.length; i++) {
        const did = web3.utils
          .toChecksumAddress(tokenOrders[i].datatokenId.address)
          .replace('0x', 'did:op:')
        didList.push(did)
      }

      const downloads = await getDownloadAssets(
        didList,
        tokenOrders,
        chainIds,
        cancelToken
      )
      setDownloads(downloads)
      setDownloadsTotal(downloads.length)
      Logger.log(
        `[profile] Fetched ${downloads.length} download orders.`,
        downloads
      )
    },
    [accountId, chainIds]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    async function getDownloadAssets() {
      if (!appConfig?.metadataCacheUri) return

      try {
        setIsDownloadsLoading(true)
        await fetchDownloads(cancelTokenSource.token)
      } catch (err) {
        Logger.log(err.message)
      } finally {
        setIsDownloadsLoading(false)
      }
    }
    getDownloadAssets()

    if (downloadsInterval) return
    const interval = setInterval(async () => {
      await fetchDownloads(cancelTokenSource.token)
    }, refreshInterval)
    setDownloadsInterval(interval)

    return () => {
      cancelTokenSource.cancel()
      clearInterval(downloadsInterval)
    }
  }, [fetchDownloads, appConfig.metadataCacheUri, downloadsInterval])

  //
  // SALES NUMBER
  //
  const [sales, setSales] = useState(0)
  useEffect(() => {
    if (!accountId || chainIds.length === 0) {
      setSales(0)
      return
    }
    async function getUserSalesNumber() {
      try {
        const result = await getUserSales(accountId, chainIds)
        setSales(result)
        Logger.log(`[profile] Fetched sales number: ${result}.`, result)
      } catch (error) {
        Logger.error(error.message)
      }
    }
    getUserSalesNumber()
  }, [accountId, chainIds])

  return (
    <ProfileContext.Provider
      value={{
        profile,
        poolShares,
        isPoolSharesLoading,
        assets,
        assetsTotal,
        isEthAddress,
        downloads,
        downloadsTotal,
        isDownloadsLoading,
        sales
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

// Helper hook to access the provider values
const useProfile = (): ProfileProviderValue => useContext(ProfileContext)

export { ProfileProvider, useProfile, ProfileContext }
export default ProfileProvider
