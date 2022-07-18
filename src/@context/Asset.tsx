import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactElement,
  useCallback,
  ReactNode
} from 'react'
import { Config, LoggerInstance, Purgatory } from '@oceanprotocol/lib'
import { CancelToken } from 'axios'
import { checkV3Asset, retrieveAsset } from '@utils/aquarius'
import { useWeb3 } from './Web3'
import { useCancelToken } from '@hooks/useCancelToken'
import { getOceanConfig, getDevelopmentConfig } from '@utils/ocean'
import { AssetExtended } from 'src/@types/AssetExtended'
import { getAccessDetails } from '@utils/accessDetailsAndPricing'
import { useIsMounted } from '@hooks/useIsMounted'
import { useMarketMetadata } from './MarketMetadata'

export interface AssetProviderValue {
  isInPurgatory: boolean
  purgatoryData: Purgatory
  asset: AssetExtended
  title: string
  owner: string
  error?: string
  warning?: string
  isAssetNetwork: boolean
  isV3Asset: boolean
  isOwner: boolean
  oceanConfig: Config
  loading: boolean
  fetchAsset: (token?: CancelToken) => Promise<void>
}

const AssetContext = createContext({} as AssetProviderValue)

function AssetProvider({
  did,
  children
}: {
  did: string
  children: ReactNode
}): ReactElement {
  const { appConfig } = useMarketMetadata()

  const { chainId, accountId } = useWeb3()
  const [isInPurgatory, setIsInPurgatory] = useState(false)
  const [purgatoryData, setPurgatoryData] = useState<Purgatory>()
  const [asset, setAsset] = useState<AssetExtended>()
  const [title, setTitle] = useState<string>()
  const [owner, setOwner] = useState<string>()
  const [isOwner, setIsOwner] = useState<boolean>()
  const [error, setError] = useState<string>()
  const [warning, setWarning] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [isAssetNetwork, setIsAssetNetwork] = useState<boolean>()
  const [isV3Asset, setIsV3Asset] = useState<boolean>()
  const [oceanConfig, setOceanConfig] = useState<Config>()

  const newCancelToken = useCancelToken()
  const isMounted = useIsMounted()

  // -----------------------------------
  // Helper: Get and set asset based on passed DID
  // -----------------------------------
  const fetchAsset = useCallback(
    async (token?: CancelToken) => {
      if (!did) return

      LoggerInstance.log('[asset] Fetching asset...')
      setLoading(true)
      const asset = await retrieveAsset(did, token)

      if (!asset) {
        setIsV3Asset(await checkV3Asset(did, token))
        setError(
          `\`${did}\`` +
            '\n\nWe could not find an asset for this DID in the cache. If you just published a new asset, wait some seconds and refresh this page.'
        )
        LoggerInstance.error(`[asset] Failed getting asset for ${did}`, asset)
        return
      }

      if (asset.nft.state) {
        let message
        switch (asset.nft.state) {
          case 1:
            message = 'This asset is in End-of-life.'
            break
          case 2:
            message = 'This asset has been deprecated.'
            break
          case 3:
            message = 'This asset has been revoked.'
            break
        }

        setIsV3Asset(await checkV3Asset(did, token))
        setWarning(`\`${did}\`` + `\n\n${message}`)
        LoggerInstance.error(`[asset] Failed getting asset for ${did}`, asset)
        return
      }

      if (asset) {
        setError(undefined)
        setAsset((prevState) => ({
          ...prevState,
          ...asset
        }))
        setTitle(asset.metadata?.name)
        setOwner(asset.nft?.owner)
        setIsInPurgatory(asset.purgatory?.state)
        setPurgatoryData(asset.purgatory)
        LoggerInstance.log('[asset] Got asset', asset)
      }

      setLoading(false)
    },
    [did]
  )

  // -----------------------------------
  // Helper: Get and set asset access details
  // -----------------------------------
  const fetchAccessDetails = useCallback(async (): Promise<void> => {
    if (!asset?.chainId || !asset?.services) return
    const accessDetails = await getAccessDetails(
      asset.chainId,
      asset.services[0].datatokenAddress,
      asset.services[0].timeout,
      accountId
    )
    setAsset((prevState) => ({
      ...prevState,
      accessDetails
    }))
    LoggerInstance.log(`[asset] Got access details for ${did}`, accessDetails)
  }, [asset?.chainId, asset?.services, accountId, did])

  // -----------------------------------
  // 1. Get and set asset based on passed DID
  // -----------------------------------
  useEffect(() => {
    if (!isMounted || !appConfig?.metadataCacheUri) return

    fetchAsset(newCancelToken())
  }, [appConfig?.metadataCacheUri, fetchAsset, newCancelToken, isMounted])

  // -----------------------------------
  // 2. Attach access details to asset
  // -----------------------------------
  useEffect(() => {
    if (!isMounted) return

    fetchAccessDetails()
  }, [accountId, fetchAccessDetails, isMounted])

  // -----------------------------------
  // Check user network against asset network
  // -----------------------------------
  useEffect(() => {
    if (!chainId || !asset?.chainId) return

    const isAssetNetwork = chainId === asset?.chainId
    setIsAssetNetwork(isAssetNetwork)
  }, [chainId, asset?.chainId])

  // -----------------------------------
  // Asset owner check against wallet user
  // -----------------------------------
  useEffect(() => {
    if (!accountId || !owner) return

    const isOwner = accountId?.toLowerCase() === owner.toLowerCase()
    setIsOwner(isOwner)
  }, [accountId, owner])

  // -----------------------------------
  // Load ocean config based on asset network
  // -----------------------------------
  useEffect(() => {
    if (!asset?.chainId) return

    const oceanConfig = {
      ...getOceanConfig(asset?.chainId),

      // add local dev values
      ...(asset?.chainId === 8996 && {
        ...getDevelopmentConfig()
      })
    }
    setOceanConfig(oceanConfig)
  }, [asset?.chainId])

  return (
    <AssetContext.Provider
      value={
        {
          asset,
          did,
          title,
          owner,
          error,
          warning,
          isInPurgatory,
          purgatoryData,
          loading,
          fetchAsset,
          isAssetNetwork,
          isV3Asset,
          isOwner,
          oceanConfig
        } as AssetProviderValue
      }
    >
      {children}
    </AssetContext.Provider>
  )
}

// Helper hook to access the provider values
const useAsset = (): AssetProviderValue => useContext(AssetContext)

export { AssetProvider, useAsset, AssetContext }
export default AssetProvider
