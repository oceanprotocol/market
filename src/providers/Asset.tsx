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
import { CancelToken } from 'axios'
import axios from 'axios'

interface AssetProviderValue {
  isInPurgatory: boolean
  purgatoryData: PurgatoryData
  ddo: DDO | undefined
  did: string | undefined
  metadata: Metadata | undefined
  title: string | undefined
  owner: string | undefined
  price: BestPrice | undefined
  refreshInterval: number
  refreshPrice: () => Promise<void>
}

const AssetContext = createContext({} as AssetProviderValue)

const refreshInterval = 15000 // 15 sec.

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

  const getDDO = useCallback(
    async (did: string, cancelToken: CancelToken): Promise<DDO | undefined> => {
      if (!config.metadataCacheUri) return

      const request = await axios.get(
        `${config.metadataCacheUri}/api/v1/aquarius/assets/ddo/${did}`,
        { cancelToken }
      )
      const ddo = request.data as DDO

      return new DDO(ddo)
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
      if (isDDO(asset as string | DDO)) {
        setDDO(asset as DDO)
        setDID((asset as DDO).id)
      } else {
        // asset is a DID
        const ddo = await getDDO(asset as string, source.token)
        if (!isMounted) return
        Logger.debug('DDO', ddo)
        setDDO(ddo)
        setDID(asset as string)
      }
    }
    init()
    return () => {
      isMounted = false
      source.cancel()
    }
  }, [asset])

  useEffect(() => {
    // Re-fetch price periodically, triggering re-calculation of everything
    let isMounted = true
    const interval = setInterval(async () => {
      if (!isMounted) return
      refreshPrice()
    }, refreshInterval)
    return () => {
      clearInterval(interval)
      isMounted = false
    }
  }, [ddo, networkId])

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

  const getMetadata = useCallback(async (ddo: DDO): Promise<Metadata> => {
    const metadata = ddo.findServiceByType('metadata')
    return metadata.attributes
  }, [])

  const initMetadata = useCallback(async (ddo: DDO): Promise<void> => {
    if (!ddo) return
    Logger.log('Init metadata')
    // Set price from DDO first
    setPrice(ddo.price)

    const metadata = await getMetadata(ddo)
    setMetadata(metadata)
    setTitle(metadata.main.name)
    setOwner(ddo.publicKey[0].owner)

    await setPurgatory(ddo.id)
    refreshPrice()
  }, [])

  useEffect(() => {
    if (!ddo) return
    initMetadata(ddo)
  }, [ddo])

  async function refreshPrice(): Promise<void> {
    if (
      !ddo ||
      status !== 1 ||
      networkId !== (config as ConfigHelperConfig).networkId
    )
      return

    setPrice(
      await getDataTokenPrice(
        ocean,
        ddo.dataToken,
        ddo?.price?.type,
        ddo.price.pools[0]
      )
    )
  }
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
