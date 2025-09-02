import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactElement,
  useCallback,
  ReactNode
} from 'react'
import { useUserPreferences } from '../UserPreferences'
import { LoggerInstance } from '@oceanprotocol/lib'
import {
  getDownloadAssets,
  getPublishedAssets,
  getUserOrders,
  getUserSales
} from '@utils/aquarius'
import axios, { CancelToken } from 'axios'
import { useMarketMetadata } from '../MarketMetadata'
import { getEnsProfile } from '@utils/ens'
import { Asset } from '@oceanprotocol/ddo-js'
import { isAddress } from 'ethers'

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
  handlePageChange: (pageNumber: number) => void
}

const ProfileContext = createContext({} as ProfileProviderValue)

const refreshInterval = 30000 // 30 sec.

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
  const [profile, setProfile] = useState<Profile>({ name: accountEns })
  const [assets, setAssets] = useState<Asset[]>()
  const [assetsTotal, setAssetsTotal] = useState(0)
  const [downloads, setDownloads] = useState<DownloadedAsset[]>()
  const [downloadsTotal, setDownloadsTotal] = useState(0)
  const [isDownloadsLoading, setIsDownloadsLoading] = useState<boolean>()
  const [currentPage, setCurrentPage] = useState(1)
  const [sales, setSales] = useState(0)

  // Check if accountId is a valid Ethereum address
  useEffect(() => {
    const isEthAddress = isAddress(accountId)
    setIsEthAddress(isEthAddress)
  }, [accountId])

  // Fetch ENS profile
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

  // Fetch published assets
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
      } catch (error) {
        LoggerInstance.error(error.message)
      }
    }
    getAllPublished()

    return () => {
      cancelTokenSource.cancel()
    }
  }, [accountId, chainIds, isEthAddress, ownAccount])

  // Fetch downloads
  const fetchDownloads = useCallback(
    async (cancelToken: CancelToken, page = 1) => {
      if (!accountId || !chainIds) return

      const dtList: string[] = []
      try {
        const orders = await getUserOrders(accountId, cancelToken)
        if (orders?.results?.length) {
          dtList.push(...orders.results.map((order) => order.datatokenAddress))
        }

        const result = await getDownloadAssets(
          dtList,
          chainIds,
          cancelToken,
          ownAccount,
          page
        )
        if (!result) {
          LoggerInstance.error('getDownloadAssets returned undefined')
          setDownloads([])
          setDownloadsTotal(0)
          return
        }

        const { downloadedAssets, totalResults } = result
        const sanitizedAssets = downloadedAssets.map((asset) => ({
          ...asset,
          timestamp: isNaN(asset.timestamp) ? 0 : asset.timestamp
        }))
        setDownloads(sanitizedAssets)
        setDownloadsTotal(totalResults)
        LoggerInstance.log(
          `[profile] Fetched ${sanitizedAssets.length} download orders.`,
          sanitizedAssets
        )
      } catch (error) {
        LoggerInstance.error('Error in fetchDownloads:', error.message)
        setDownloads([])
        setDownloadsTotal(0)
      }
    },
    [accountId, chainIds, ownAccount]
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    if (!accountId || !isEthAddress || !appConfig?.metadataCacheUri) {
      setDownloads([])
      setDownloadsTotal(0)
      setIsDownloadsLoading(false)
      return
    }

    const cancelTokenSource = axios.CancelToken.source()

    const fetchData = async () => {
      try {
        setIsDownloadsLoading(true)
        await fetchDownloads(cancelTokenSource.token, currentPage)
      } catch (err) {
        LoggerInstance.error('Error fetching downloads:', err.message)
      } finally {
        setIsDownloadsLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, refreshInterval)

    return () => {
      cancelTokenSource.cancel('Cleanup: Request canceled')
      clearInterval(interval)
    }
  }, [
    accountId,
    isEthAddress,
    appConfig?.metadataCacheUri,
    currentPage,
    fetchDownloads
  ])

  // Fetch sales number
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
        handlePageChange,
        ownAccount,
        sales
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

const useProfile = (): ProfileProviderValue => useContext(ProfileContext)

export { ProfileProvider, useProfile, ProfileContext }
export default ProfileProvider
