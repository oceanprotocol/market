import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactElement,
  useCallback,
  ReactNode
} from 'react'
import { Logger, DDO, Metadata, BestPrice } from '@oceanprotocol/lib'
import { PurgatoryData } from '@oceanprotocol/lib/dist/node/ddo/interfaces/PurgatoryData'
import { isDDO, getDataTokenPrice, useOcean } from '@oceanprotocol/react'
import getAssetPurgatoryData from '../utils/purgatory'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'
import axios, { CancelToken } from 'axios'

interface AssetProviderValue {
  isInPurgatory: boolean
  purgatoryData: PurgatoryData
  ddo: DDO | undefined
  did: string | undefined
  metadata: Metadata | undefined
  title: string | undefined
  owner: string | undefined
  price: BestPrice | undefined
  error?: string
  refreshInterval: number
  refreshPrice: () => Promise<void>
}

const AssetContext = createContext({} as AssetProviderValue)

const refreshInterval = 10000 // 10 sec.

// TODO component still WIP , only isInPurgatory, purgatoryData and price are relevant
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
  const [metadata, setMetadata] = useState<Metadata>()
  const [title, setTitle] = useState<string>()
  const [price, setPrice] = useState<BestPrice>()
  const [owner, setOwner] = useState<string>()
  const [error, setError] = useState<string>()

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
      ddo.price.pools[0]
    )
    setPrice(newPrice)
    Logger.log(`Refreshed asset price: ${newPrice?.value}`)
  }, [ocean, config, ddo, networkId, status])

  const getDDO = useCallback(
    async (did: string, cancelToken: CancelToken): Promise<DDO | undefined> => {
      if (!config.metadataCacheUri) return

      try {
        const request = await axios.get(
          `${config.metadataCacheUri}/api/v1/aquarius/assets/ddo/${did}`,
          { cancelToken }
        )
        const ddo = request.data as DDO
        return new DDO(ddo)
      } catch (error) {
        Logger.error(error.message)
        return undefined
      }
    },
    [config.metadataCacheUri]
  )

  //
  // Get and set DDO based on passed DDO or DID
  //
  useEffect(() => {
    if (!asset) return

    const source = axios.CancelToken.source()
    let isMounted = true
    Logger.log('Init asset, get ddo')

    async function init(): Promise<void> {
      const ddo = await getDDO(asset as string, source.token)

      if (!ddo) {
        setError(
          `The DDO for ${asset} was not found in MetadataCache. If you just published a new data set, wait some seconds and refresh this page.`
        )
      } else {
        setError(undefined)
      }

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
  }, [asset, getDDO])

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
      } else {
        setIsInPurgatory(false)
      }
      setPurgatoryData(result)
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
      setMetadata(attributes)
      setTitle(attributes?.main.name)
      setOwner(ddo.publicKey[0].owner)

      await setPurgatory(ddo.id)
      refreshPrice()
    },
    [refreshPrice, setPurgatory]
  )

  useEffect(() => {
    if (!ddo) return
    initMetadata(ddo)
  }, [ddo])

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
