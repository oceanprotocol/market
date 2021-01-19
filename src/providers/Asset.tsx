import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactElement,
  useCallback,
  ReactNode
} from 'react'
import { Logger, DDO, BestPrice } from '@oceanprotocol/lib'
import { PurgatoryData } from '@oceanprotocol/lib/dist/node/ddo/interfaces/PurgatoryData'
import { getDataTokenPrice, useOcean } from '@oceanprotocol/react'
import getAssetPurgatoryData from '../utils/purgatory'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'
import axios, { CancelToken } from 'axios'
import { retrieveDDO } from '../utils/aquarius'
import { MetadataMarket } from '../@types/MetaData'
import { EwaiClient, IEwaiLookupAssetResult } from '../ewai/client/ewai-js'

interface AssetProviderValue {
  isInPurgatory: boolean
  purgatoryData: PurgatoryData
  ddo: DDO | undefined
  did: string | undefined
  metadata: MetadataMarket | undefined
  title: string | undefined
  owner: string | undefined
  price: BestPrice | undefined
  error?: string
  refreshInterval: number
  // -- ewai info --
  ewaiAsset?: IEwaiLookupAssetResult
  refreshDdo: (token?: CancelToken) => Promise<void>
  refreshPrice: () => Promise<void>
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
  const { ocean, status, config, networkId } = useOcean()
  const [isInPurgatory, setIsInPurgatory] = useState(false)
  const [purgatoryData, setPurgatoryData] = useState<PurgatoryData>()
  const [ddo, setDDO] = useState<DDO>()
  const [did, setDID] = useState<string>()
  const [metadata, setMetadata] = useState<MetadataMarket>()
  const [title, setTitle] = useState<string>()
  const [price, setPrice] = useState<BestPrice>()
  const [owner, setOwner] = useState<string>()
  const [error, setError] = useState<string>()
  const [ewaiAsset, setEwaiAsset] = useState<IEwaiLookupAssetResult>()

  const refreshPrice = useCallback(async () => {
    if (
      !ddo ||
      status !== 1 ||
      networkId !== (config as ConfigHelperConfig).networkId
    )
      return

    const newPrice = await getDataTokenPrice(
      ocean,
      ddo.dataToken,
      ddo?.price?.type,
      ddo.price.address
    )
    setPrice(newPrice)
    Logger.log(`Refreshed asset price: ${newPrice?.value}`)
  }, [ocean, config, ddo, networkId, status])

  const fetchDdo = async (token?: CancelToken) => {
    Logger.log('Init asset, get ddo')
    const ddo = await retrieveDDO(
      asset as string,
      config.metadataCacheUri,
      token
    )

    if (!ddo) {
      setError(
        `The DDO for ${asset} was not found in MetadataCache. If you just published a new data set, wait some seconds and refresh this page.`
      )
    } else {
      setError(undefined)
    }
    return ddo
  }

  const refreshDdo = async (token?: CancelToken) => {
    const ddo = await fetchDdo(token)
    Logger.debug('DDO', ddo)
    setDDO(ddo)
  }
  //
  // Get and set DDO based on passed DDO or DID
  //
  useEffect(() => {
    if (!asset || !config?.metadataCacheUri) return

    const source = axios.CancelToken.source()
    let isMounted = true
    Logger.log('Init asset, get ddo')

    async function init() {
      const ddo = await fetchDdo(source.token)
      if (!isMounted) return
      Logger.debug('DDO', ddo)
      setDDO(ddo)
      setDID(asset as string)
    }
    init()
    return () => {
      isMounted = false
      source.cancel()
    }
  }, [asset, config?.metadataCacheUri])

  useEffect(() => {
    // Re-fetch price periodically, triggering re-calculation of everything
    let isMounted = true

    const interval = setInterval(() => {
      if (!isMounted) return
      refreshPrice()
    }, refreshInterval)

    return () => {
      clearInterval(interval)
      isMounted = false
    }
  }, [ddo, networkId, refreshPrice])

  const setPurgatory = useCallback(async (did: string): Promise<void> => {
    if (!did) return
    try {
      const result = await getAssetPurgatoryData(did)

      if (result?.did !== undefined) {
        setIsInPurgatory(true)
        setPurgatoryData(result)
        return
      }

      setIsInPurgatory(false)
    } catch (error) {
      Logger.error(error)
    }
  }, [])

  const initMetadata = useCallback(
    async (ddo: DDO): Promise<void> => {
      if (!ddo) return

      Logger.log('Init metadata')
      // Set price & metadata from DDO first
      setPrice(ddo.price)
      const { attributes } = ddo.findServiceByType('metadata')
      setMetadata((attributes as unknown) as MetadataMarket)
      setTitle(attributes?.main.name)
      setOwner(ddo.publicKey[0].owner)
      setIsInPurgatory(ddo.isInPurgatory === 'true')

      await setPurgatory(ddo.id)
      await refreshPrice()
    },
    [refreshPrice, setPurgatory]
  )

  const initEwai = useCallback(
    async (ddo: DDO): Promise<void> => {
      if (!ddo) return
      Logger.log('Init ewai')
      // ---------------------------------------------
      // retrieve EWAI asset info
      // ---------------------------------------------
      const ewaiClient = new EwaiClient({
        username: process.env.EWAI_API_USERNAME,
        password: process.env.EWAI_API_PASSWORD,
        graphQlUrl: process.env.EWAI_API_GRAPHQL_URL
      })
      try {
        const ewaiAsset = await ewaiClient.lookupEwaiAssetAsync(ddo.id)
        setEwaiAsset(ewaiAsset)
      } catch (error) {
        Logger.log(error.message)
        setError(error.message)
      }
    },
    [ddo, setEwaiAsset]
  )

  useEffect(() => {
    if (!ddo) return
    initMetadata(ddo)
    initEwai(ddo)
  }, [ddo, initMetadata, initEwai])

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
          error,
          isInPurgatory,
          purgatoryData,
          refreshInterval,
          ewaiAsset,
          refreshDdo,
          refreshPrice
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
