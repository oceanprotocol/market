import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactElement,
  useCallback,
  ReactNode
} from 'react'
import { Logger, DDO, BestPrice, MetadataMain } from '@oceanprotocol/lib'
import { PurgatoryData } from '@oceanprotocol/lib/dist/node/ddo/interfaces/PurgatoryData'
import getAssetPurgatoryData from '../utils/purgatory'
import axios, { CancelToken } from 'axios'
import { retrieveDDO } from '../utils/aquarius'
import { getPrice } from '../utils/subgraph'
import { MetadataMarket } from '../@types/MetaData'
import { DDO_TEMPORARY } from './Ocean'
import { useWeb3 } from './Web3'
import { useSiteMetadata } from '../hooks/useSiteMetadata'

interface AssetProviderValue {
  isInPurgatory: boolean
  purgatoryData: PurgatoryData
  ddo: DDO
  did: string
  metadata: MetadataMarket
  title: string
  owner: string
  price: BestPrice
  type: MetadataMain['type']
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
  asset: string | DDO
  children: ReactNode
}): ReactElement {
  const { appConfig } = useSiteMetadata()

  const { networkId } = useWeb3()
  const [isInPurgatory, setIsInPurgatory] = useState(false)
  const [purgatoryData, setPurgatoryData] = useState<PurgatoryData>()
  const [ddo, setDDO] = useState<DDO>()
  const [did, setDID] = useState<string>()
  const [metadata, setMetadata] = useState<MetadataMarket>()
  const [title, setTitle] = useState<string>()
  const [price, setPrice] = useState<BestPrice>()
  const [owner, setOwner] = useState<string>()
  const [error, setError] = useState<string>()
  const [type, setType] = useState<MetadataMain['type']>()
  const [loading, setLoading] = useState(false)
  const [isAssetNetwork, setIsAssetNetwork] = useState<boolean>()

  const fetchDdo = async (token?: CancelToken) => {
    Logger.log('[asset] Init asset, get DDO')
    setLoading(true)
    const ddo = await retrieveDDO(
      asset as string,
      appConfig.metadataCacheUri,
      token
    )

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
    Logger.debug('[asset] Got DDO', ddo)
    setDDO(ddo)
    setLoading(false)
  }

  //
  // Get and set DDO based on passed DDO or DID
  //
  useEffect(() => {
    if (!asset || !appConfig.metadataCacheUri) return

    const source = axios.CancelToken.source()
    let isMounted = true

    async function init() {
      const ddo = await fetchDdo(source.token)
      if (!isMounted) return
      Logger.debug('[asset] Got DDO', ddo)
      setDDO(ddo)
      setDID(asset as string)
    }
    init()
    return () => {
      isMounted = false
      source.cancel()
    }
  }, [asset, appConfig.metadataCacheUri])

  const setPurgatory = useCallback(async (did: string): Promise<void> => {
    if (!did) return

    try {
      const result = await getAssetPurgatoryData(did)
      const isInPurgatory = result?.did !== undefined
      setIsInPurgatory(isInPurgatory)
      isInPurgatory && setPurgatoryData(result)
    } catch (error) {
      Logger.error(error)
    }
  }, [])

  const initMetadata = useCallback(async (ddo: DDO): Promise<void> => {
    if (!ddo) return
    setLoading(true)
    const returnedPrice = await getPrice(ddo)
    setPrice({ ...returnedPrice })

    // Get metadata from DDO
    const { attributes } = ddo.findServiceByType('metadata')
    setMetadata(attributes as unknown as MetadataMarket)
    setTitle(attributes?.main.name)
    setType(attributes.main.type)
    setOwner(ddo.publicKey[0].owner)
    Logger.log('[asset] Got Metadata from DDO', attributes)

    setIsInPurgatory(ddo.isInPurgatory === 'true')
    await setPurgatory(ddo.id)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!ddo) return
    initMetadata(ddo)
  }, [ddo, initMetadata])

  // Check user network against asset network
  useEffect(() => {
    if (!networkId || !ddo) return

    // TODO: remove typing once present in ocean.js' DDO typing
    const isAssetNetwork = networkId === (ddo as DDO_TEMPORARY).chainId
    setIsAssetNetwork(isAssetNetwork)
  }, [networkId, ddo])

  return (
    <AssetContext.Provider
      value={
        {
          ddo,
          did,
          metadata,
          title,
          owner,
          price,
          type,
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

export { AssetProvider, useAsset, AssetProviderValue, AssetContext }
export default AssetProvider
