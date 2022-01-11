import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactElement,
  useCallback,
  ReactNode
} from 'react'
import { Asset, LoggerInstance, Purgatory } from '@oceanprotocol/lib'
import getAssetPurgatoryData from '@utils/purgatory'
import { CancelToken } from 'axios'
import { retrieveDDO } from '@utils/aquarius'
import { getPrice } from '@utils/subgraph'
import { useWeb3 } from './Web3'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import { useCancelToken } from '@hooks/useCancelToken'

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
  loading: boolean
  refreshDdo: (token?: CancelToken) => Promise<void>
}

const AssetContext = createContext({} as AssetProviderValue)

const refreshInterval = 10000 // 10 sec.

function AssetProvider({
  asset,
  children
}: {
  asset: string | Asset
  children: ReactNode
}): ReactElement {
  const { appConfig } = useSiteMetadata()

  const { networkId } = useWeb3()
  const [isInPurgatory, setIsInPurgatory] = useState(false)
  const [purgatoryData, setPurgatoryData] = useState<Purgatory>()
  const [ddo, setDDO] = useState<Asset>()
  const [did, setDID] = useState<string>()
  const [title, setTitle] = useState<string>()
  const [price, setPrice] = useState<BestPrice>()
  const [owner, setOwner] = useState<string>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [isAssetNetwork, setIsAssetNetwork] = useState<boolean>()

  const newCancelToken = useCancelToken()

  const fetchDdo = async (token?: CancelToken) => {
    LoggerInstance.log('[asset] Init asset, get DDO')
    setLoading(true)
    const ddo = await retrieveDDO(asset as string, token)

    if (!ddo) {
      setError(
        `[asset] The DDO for ${asset} was not found in MetadataCache. If you just published a new data set, wait some seconds and refresh this page.`
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

  //
  // Get and set DDO based on passed DDO or DID
  //
  useEffect(() => {
    if (!asset || !appConfig.metadataCacheUri) return

    let isMounted = true

    async function init() {
      const ddo = await fetchDdo(newCancelToken())
      if (!isMounted || !ddo) return
      LoggerInstance.debug('[asset] Got DDO', ddo)
      setDDO(ddo)
      setDID(asset as string)
      setTitle(ddo.metadata.name)
      setOwner(ddo.nft.owner)
      setIsInPurgatory(ddo.purgatory.state === true)
      await setPurgatory(ddo.id)
    }
    init()
    return () => {
      isMounted = false
    }
  }, [asset, appConfig.metadataCacheUri])

  const initPrice = useCallback(async (ddo: Asset): Promise<void> => {
    if (!ddo) return
    const returnedPrice = await getPrice(ddo)
    setPrice({ ...returnedPrice })
  }, [])

  useEffect(() => {
    if (!ddo) return
    initPrice(ddo)
  }, [ddo, initPrice])

  // Check user network against asset network
  useEffect(() => {
    if (!networkId || !ddo) return

    const isAssetNetwork = networkId === ddo?.chainId
    setIsAssetNetwork(isAssetNetwork)
  }, [networkId, ddo])

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
          isAssetNetwork
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
