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
import getAssetPurgatoryData from '@utils/purgatory'
import { CancelToken } from 'axios'
import { retrieveDDO } from '@utils/aquarius'
import { getPrice } from '@utils/subgraph'
import { useWeb3 } from './Web3'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import { useCancelToken } from '@hooks/useCancelToken'
import { getOceanConfig, getDevelopmentConfig } from '@utils/ocean'

interface AssetProviderValue {
  isInPurgatory: boolean
  purgatoryData: Purgatory
  ddo: Asset
  title: string
  owner: string
  price: BestPrice
  error?: string
  refreshInterval: number
  isAssetNetwork: boolean
  oceanConfig: Config
  loading: boolean
  refreshDdo: (token?: CancelToken) => Promise<void>
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

  const { networkId } = useWeb3()
  const [isInPurgatory, setIsInPurgatory] = useState(false)
  const [purgatoryData, setPurgatoryData] = useState<Purgatory>()
  const [ddo, setDDO] = useState<Asset>()
  const [title, setTitle] = useState<string>()
  const [price, setPrice] = useState<BestPrice>()
  const [owner, setOwner] = useState<string>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [isAssetNetwork, setIsAssetNetwork] = useState<boolean>()
  const [oceanConfig, setOceanConfig] = useState<Config>()

  const newCancelToken = useCancelToken()

  const fetchDdo = async (token?: CancelToken) => {
    LoggerInstance.log('[asset] Init asset, get DDO')
    setLoading(true)
    const ddo = await retrieveDDO(did, token)

    if (!ddo) {
      setError(
        `[asset] The DDO for ${did} was not found in MetadataCache. If you just published a new data set, wait some seconds and refresh this page.`
      )
    } else {
      setError(undefined)
    }
    setLoading(false)
    return ddo
  }

  const refreshDdo = async (token?: CancelToken) => {
    setLoading(true)
    const ddo = await fetchDdo(token)
    LoggerInstance.debug('[asset] Got DDO', ddo)
    setDDO(ddo)
    setLoading(false)
  }

  const setPurgatory = useCallback(async (did: string): Promise<void> => {
    if (!did) return

    try {
      const result = await getAssetPurgatoryData(did)
      const isInPurgatory = result?.state === true
      setIsInPurgatory(isInPurgatory)
      isInPurgatory && setPurgatoryData(result)
    } catch (error) {
      LoggerInstance.error(error)
    }
  }, [])

  // -----------------------------------
  // Get and set DDO based on passed DID
  // -----------------------------------
  useEffect(() => {
    if (!did || !appConfig.metadataCacheUri) return

    let isMounted = true

    async function init() {
      const ddo = await fetchDdo(newCancelToken())
      if (!isMounted || !ddo) return
      LoggerInstance.debug('[asset] Got DDO', ddo)
      setDDO(ddo)
      setTitle(ddo.metadata.name)
      setOwner(ddo.nft.owner)
      // TODO: restore asset purgatory once Aquarius supports it, ref #953
      // setIsInPurgatory(ddo.purgatory.state === true)
      await setPurgatory(ddo.id)
    }
    init()
    return () => {
      isMounted = false
    }
  }, [did, appConfig.metadataCacheUri])

  // -----------------------------------
  // Attach price to asset
  // -----------------------------------
  const initPrice = useCallback(async (ddo: Asset): Promise<void> => {
    if (!ddo) return
    const returnedPrice = await getPrice(ddo)
    setPrice({ ...returnedPrice })
  }, [])

  useEffect(() => {
    if (!ddo) return
    initPrice(ddo)
  }, [ddo, initPrice])

  // -----------------------------------
  // Check user network against asset network
  // -----------------------------------
  useEffect(() => {
    if (!networkId || !ddo) return

    const isAssetNetwork = networkId === ddo?.chainId
    setIsAssetNetwork(isAssetNetwork)
  }, [networkId, ddo])

  // -----------------------------------
  // Load ocean config based on asset network
  // -----------------------------------
  useEffect(() => {
    if (!ddo?.chainId) return

    const oceanConfig = {
      ...getOceanConfig(ddo?.chainId),

      // add local dev values
      ...(ddo?.chainId === 8996 && {
        ...getDevelopmentConfig()
      })
    }
    setOceanConfig(oceanConfig)
  }, [ddo])

  return (
    <AssetContext.Provider
      value={
        {
          ddo,
          did,
          title,
          owner,
          price,
          error,
          isInPurgatory,
          purgatoryData,
          refreshInterval,
          loading,
          refreshDdo,
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
