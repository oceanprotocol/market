import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactElement,
  useCallback,
  ReactNode
} from 'react'
import { Asset, Config, LoggerInstance, Purgatory } from '@oceanprotocol/lib'
import { CancelToken } from 'axios'
import { retrieveDDO } from '@utils/aquarius'
import { useWeb3 } from './Web3'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import { useCancelToken } from '@hooks/useCancelToken'
import { getOceanConfig, getDevelopmentConfig } from '@utils/ocean'
import { AssetExtended } from 'src/@types/AssetExtended'
import { getAccessDetails } from '@utils/accessDetailsAndPricing'

interface AssetProviderValue {
  isInPurgatory: boolean
  purgatoryData: Purgatory
  assetExtended: AssetExtended
  title: string
  owner: string
  accessDetails: AccessDetails
  error?: string
  refreshInterval: number
  isAssetNetwork: boolean
  oceanConfig: Config
  loading: boolean
  refreshAsset: (token?: CancelToken) => Promise<void>
}

const AssetContext = createContext({} as AssetProviderValue)

const refreshInterval = 10000 // 10 sec.

function AssetProvider({
  did,
  children
}: {
  did: string
  children: ReactNode
}): ReactElement {
  const { appConfig } = useSiteMetadata()

  const { networkId, accountId } = useWeb3()
  const [isInPurgatory, setIsInPurgatory] = useState(false)
  const [purgatoryData, setPurgatoryData] = useState<Purgatory>()
  const [assetExtended, setAssetExtended] = useState<Asset>()
  const [title, setTitle] = useState<string>()
  const [accessDetails, setConsumeDetails] = useState<AccessDetails>()
  const [owner, setOwner] = useState<string>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [isAssetNetwork, setIsAssetNetwork] = useState<boolean>()
  const [oceanConfig, setOceanConfig] = useState<Config>()

  const newCancelToken = useCancelToken()

  const fetchAsset = useCallback(
    async (token?: CancelToken) => {
      LoggerInstance.log('[asset] Init asset, get assetExtended')
      setLoading(true)
      const assetExtended = await retrieveDDO(did, token)

      if (!assetExtended) {
        setError(
          `[asset] The assetExtended for ${did} was not found in MetadataCache. If you just published a new data set, wait some seconds and refresh this page.`
        )
      } else {
        setError(undefined)
      }
      setLoading(false)
      return assetExtended
    },
    [did]
  )

  const refreshAsset = async (token?: CancelToken) => {
    setLoading(true)
    const assetExtended = await fetchAsset(token)
    LoggerInstance.debug('[asset] Got assetExtended', assetExtended)
    setAssetExtended(assetExtended)
    setLoading(false)
  }

  // -----------------------------------
  // Get and set assetExtended based on passed DID
  // -----------------------------------
  useEffect(() => {
    if (!did || !appConfig.metadataCacheUri) return

    let isMounted = true

    async function init() {
      const assetExtended = await fetchAsset(newCancelToken())
      if (!isMounted || !assetExtended) return
      LoggerInstance.debug('[asset] Got assetExtended', assetExtended)
      setAssetExtended(assetExtended)
      setTitle(assetExtended.metadata.name)
      setOwner(assetExtended.nft.owner)
      setIsInPurgatory(
        (assetExtended.purgatory?.state as unknown as string) === 'true'
      )
      setPurgatoryData(assetExtended.purgatory)
    }
    init()
    return () => {
      isMounted = false
    }
  }, [did, appConfig.metadataCacheUri, fetchAsset, newCancelToken])

  // -----------------------------------
  // Attach price to asset
  // -----------------------------------
  const initPrice = useCallback(
    async (assetExtended: AssetExtended, accountId: string): Promise<void> => {
      if (!assetExtended) return
      const accessDetails = await getAccessDetails(
        assetExtended.chainId,
        assetExtended.services[0].datatokenAddress,
        assetExtended.services[0].timeout,
        accountId
      )
      assetExtended.accessDetails = accessDetails
      setConsumeDetails({ ...accessDetails })
      setAssetExtended(assetExtended)
    },
    []
  )

  useEffect(() => {
    if (!assetExtended) return
    initPrice(assetExtended, accountId)
  }, [accountId, assetExtended, initPrice])

  // -----------------------------------
  // Check user network against asset network
  // -----------------------------------
  useEffect(() => {
    if (!networkId || !assetExtended) return

    const isAssetNetwork = networkId === assetExtended?.chainId
    setIsAssetNetwork(isAssetNetwork)
  }, [networkId, assetExtended])

  // -----------------------------------
  // Load ocean config based on asset network
  // -----------------------------------
  useEffect(() => {
    if (!assetExtended?.chainId) return

    const oceanConfig = {
      ...getOceanConfig(assetExtended?.chainId),

      // add local dev values
      ...(assetExtended?.chainId === 8996 && {
        ...getDevelopmentConfig()
      })
    }
    setOceanConfig(oceanConfig)
  }, [assetExtended])

  return (
    <AssetContext.Provider
      value={
        {
          assetExtended,
          did,
          title,
          owner,
          accessDetails,
          error,
          isInPurgatory,
          purgatoryData,
          refreshInterval,
          loading,
          refreshAsset,
          isAssetNetwork,
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
