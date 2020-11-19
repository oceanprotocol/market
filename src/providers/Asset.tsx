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
  Logger,
  DDO,
  Metadata,
  BestPrice,
  MetadataCache
} from '@oceanprotocol/lib'
import { PurgatoryData } from '@oceanprotocol/lib/dist/node/ddo/interfaces/PurgatoryData'
import { isDDO, useOcean } from '@oceanprotocol/react'
import getAssetPurgatoryData from '../utils/purgatory'

interface AssetProviderValue {
  isInPurgatory: boolean
  purgatoryData: PurgatoryData
  ddo: DDO | undefined
  did: string | undefined
  metadata: Metadata | undefined
  title: string | undefined
  owner: string | undefined
  price: BestPrice | undefined
}

const AssetContext = createContext({} as AssetProviderValue)

// TODO component still WIP , only isInPurgatory and purgatoryData are relevant
function AssetProvider({
  asset,
  children
}: {
  asset: string | DDO
  children: ReactNode
}): ReactElement {
  const { ocean, status, config } = useOcean()
  const [isInPurgatory, setIsInPurgatory] = useState(false)
  const [purgatoryData, setPurgatoryData] = useState<PurgatoryData>()
  const [internalDdo, setDDO] = useState<DDO>()
  const [internalDid, setDID] = useState<string>()
  const [metadata, setMetadata] = useState<Metadata>()
  const [title, setTitle] = useState<string>()
  const [price, setPrice] = useState<BestPrice>()
  const [owner, setOwner] = useState<string>()

  const init = useCallback(async () => {
    Logger.log('Asset Provider init')
    if (!config.metadataCacheUri) return
    if (isDDO(asset as string | DDO)) {
      setDDO(asset as DDO)
      setDID((asset as DDO).id)
    } else {
      // asset is a DID

      const metadataCache = new MetadataCache(config.metadataCacheUri, Logger)
      const ddo = await metadataCache.retrieveDDO(asset as string)
      Logger.debug('DDO asset', ddo)
      setDDO(ddo)
      setDID(asset as string)
    }
  }, [asset, config.metadataCacheUri])

  const getPrice = useCallback(async (): Promise<BestPrice> => {
    if (!internalDdo)
      return {
        type: '',
        address: '',
        value: 0,
        ocean: 0,
        datatoken: 0
      } as BestPrice

    //   const price = await getDataTokenPrice(
    //     ocean,
    //     internalDdo.dataToken,
    //     internalDdo?.price?.type,
    //     internalDdo.price.pools[0]
    //   )
    return price
  }, [ocean, internalDdo])

  useEffect(() => {
    // removed until we can properly test and refactor market
    // init()
  }, [init, asset, ocean, status])

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

  const initMetadata = useCallback(async (): Promise<void> => {
    // remove until we can properly implement this
    // if (!internalDdo) return
    // setPrice(internalDdo.price)

    // const metadata = internalDdo.findServiceByType('metadata').attributes
    // setMetadata(metadata)
    // setTitle(metadata.main.name)
    // setOwner(internalDdo.publicKey[0].owner)

    // setIsInPurgatory(internalDdo.isInPurgatory)
    // setPurgatoryData(internalDdo.purgatoryData)
    setMetadata(undefined)
    setTitle('not_implemented')
    setOwner('not_implemented')
    if (!asset) return
    await setPurgatory(asset as string)
    // Stop here and do not start fetching from chain, when not connected properly.
    //   if (status !== 1 || networkId !== (config as ConfigHelperConfig).networkId)
    //     return

    //   // Set price again, but from chain
    //   const priceLive = await getPrice()
    //   setPrice(priceLive)
  }, [asset, getPrice])

  useEffect(() => {
    if (!asset) return
    initMetadata()
  }, [status, asset, initMetadata])

  async function refreshPrice(): Promise<void> {
    const livePrice = await getPrice()
    setPrice(livePrice)
  }
  return (
    <AssetContext.Provider
      value={
        {
          ddo: internalDdo,
          did: internalDid,
          metadata,
          title,
          owner,
          price,
          isInPurgatory,
          purgatoryData,
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
