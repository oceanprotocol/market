import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactElement,
  useCallback,
  ReactNode
} from 'react'
import { getUserTokenOrders } from '@utils/subgraph'
import { useUserPreferences } from '../UserPreferences'
import { Asset, LoggerInstance } from '@oceanprotocol/lib'
import {
  getDownloadAssets,
  getPublishedAssets,
  getUserSales
} from '@utils/aquarius'
import axios, { CancelToken } from 'axios'
import web3 from 'web3'
import { useMarketMetadata } from '../MarketMetadata'
import { getEnsProfile } from '@utils/ens'

interface ProfileProviderValue {
  profile: Profile
  assets: Asset[]
  assetsTotal: number
  isEthAddress: boolean
  downloads: DownloadedAsset[]
  downloadsTotal: number
  isDownloadsLoading: boolean
  sales: number
  ownAccount: boolean
}

const ProfileContext = createContext({} as ProfileProviderValue)

const refreshInterval = 10000 // 10 sec.

const clearedProfile: Profile = {
  name: null,
  avatar: null,
  url: null,
  description: null,
  links: null
}

function ProfileProvider({
  accountId,
  accountEns,
  ownAccount,
  children
}: {
  accountId: string
  accountEns: string
  ownAccount: boolean
  children: ReactNode
}): ReactElement {
  const { chainIds } = useUserPreferences()
  const { appConfig } = useMarketMetadata()

  const [isEthAddress, setIsEthAddress] = useState<boolean>()
  //
  // Do nothing in all following effects
  // when accountId is no ETH address
  //
  useEffect(() => {
    const isEthAddress = web3.utils.isAddress(accountId)
    setIsEthAddress(isEthAddress)
  }, [accountId])

  //
  // User profile: ENS
  //
  const [profile, setProfile] = useState<Profile>({ name: accountEns })

  useEffect(() => {
    if (!accountEns) return
    LoggerInstance.log(`[profile] ENS name found for ${accountId}:`, accountEns)
  }, [accountId, accountEns])

  useEffect(() => {
    if (
      !accountId ||
      accountId === '0x0000000000000000000000000000000000000000' ||
      !isEthAddress
    ) {
      setProfile(clearedProfile)
      return
    }

    async function getInfo() {
      const profile = await getEnsProfile(accountId)
      setProfile(profile)
      LoggerInstance.log(`[profile] ENS metadata for ${accountId}:`, profile)
    }
    getInfo()
  }, [accountId, isEthAddress])

  //
  // PUBLISHED ASSETS
  //
  const [assets, setAssets] = useState<Asset[]>()
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
          cancelTokenSource.token,
          ownAccount
        )
        setAssets(result.results)
        setAssetsTotal(result.totalResults)
        LoggerInstance.log(
          `[profile] Fetched ${result.totalResults} assets.`,
          result.results
        )

        // Hint: this would only make sense if we "search" in all subcomponents
        // against this provider's state, meaning filtering via js rather then sending
        // more queries to Aquarius.
        // const assetsWithPrices = await getAssetsBestPrices(result.results)
        // setAssetsWithPrices(assetsWithPrices)
      } catch (error) {
        LoggerInstance.error(error.message)
      }
    }
    getAllPublished()

    return () => {
      cancelTokenSource.cancel()
    }
  }, [
    accountId,
    appConfig.metadataCacheUri,
    chainIds,
    isEthAddress,
    ownAccount
  ])

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

      const dtList: string[] = []
      const tokenOrders = await getUserTokenOrders(accountId, chainIds)

      for (let i = 0; i < tokenOrders?.length; i++) {
        dtList.push(tokenOrders[i].datatoken.address)
      }

      const downloads = await getDownloadAssets(
        dtList,
        tokenOrders,
        chainIds,
        cancelToken,
        ownAccount
      )
      setDownloads(downloads)
      setDownloadsTotal(downloads.length)
      LoggerInstance.log(
        `[profile] Fetched ${downloads.length} download orders.`,
        downloads
      )
    },
    [accountId, chainIds, ownAccount]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    async function getDownloadAssets() {
      if (!appConfig?.metadataCacheUri) return

      try {
        setIsDownloadsLoading(true)
        await fetchDownloads(cancelTokenSource.token)
      } catch (err) {
        LoggerInstance.log(err.message)
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
        LoggerInstance.log(`[profile] Fetched sales number: ${result}.`, result)
      } catch (error) {
        LoggerInstance.error(error.message)
      }
    }
    getUserSalesNumber()
  }, [accountId, chainIds])

  return (
    <ProfileContext.Provider
      value={{
        profile,
        assets,
        assetsTotal,
        isEthAddress,
        downloads,
        downloadsTotal,
        isDownloadsLoading,
        ownAccount,
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
