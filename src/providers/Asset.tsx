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
import getAssetPurgatoryData from '../utils/purgatory'
import axios, { CancelToken } from 'axios'
import { retrieveDDO } from '../utils/aquarius'
import { MetadataMarket } from '../@types/MetaData'
import { useOcean } from './Ocean'
import { gql, useQuery } from '@apollo/client'
import { PoolPrice } from '../@types/apollo/PoolPrice'
import { FrePrice } from '../@types/apollo/FrePrice'

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
  refreshDdo: (token?: CancelToken) => Promise<void>
}

const poolQuery = gql`
  query PoolPrice($datatoken: String) {
    pools(where: { datatokenAddress: $datatoken }) {
      spotPrice
      datatokenReserve
      oceanReserve
    }
  }
`

const freQuery = gql`
  query FrePrice($datatoken: String) {
    fixedRateExchanges(orderBy: id, where: { datatoken: $datatoken }) {
      rate
      id
    }
  }
`

const AssetContext = createContext({} as AssetProviderValue)

const refreshInterval = 10000 // 10 sec.

function AssetProvider({
  asset,
  children
}: {
  asset: string | DDO
  children: ReactNode
}): ReactElement {
  const { config } = useOcean()
  const [isInPurgatory, setIsInPurgatory] = useState(false)
  const [purgatoryData, setPurgatoryData] = useState<PurgatoryData>()
  const [ddo, setDDO] = useState<DDO>()
  const [did, setDID] = useState<string>()
  const [metadata, setMetadata] = useState<MetadataMarket>()
  const [title, setTitle] = useState<string>()
  const [price, setPrice] = useState<BestPrice>()
  const [owner, setOwner] = useState<string>()
  const [error, setError] = useState<string>()
  const [variables, setVariables] = useState({})

  const {
    refetch: refetchFre,
    startPolling: startPollingFre,
    data: frePrice
  } = useQuery<FrePrice>(freQuery, {
    variables,
    skip: false
  })
  const {
    refetch: refetchPool,
    startPolling: startPollingPool,
    data: poolPrice
  } = useQuery<PoolPrice>(poolQuery, {
    variables,
    skip: false
  })

  // this is not working as expected, thus we need to fetch both pool and fre
  // useEffect(() => {
  //   if (!ddo || !variables || variables === '') return

  //   if (ddo.price.type === 'exchange') {
  //     refetchFre(variables)
  //     startPollingFre(refreshInterval)
  //   } else {
  //     refetchPool(variables)
  //     startPollingPool(refreshInterval)
  //   }
  // }, [ddo, variables])

  useEffect(() => {
    if (
      !frePrice ||
      frePrice.fixedRateExchanges.length === 0 ||
      price.type !== 'exchange'
    )
      return
    setPrice((prevState) => ({
      ...prevState,
      value: frePrice.fixedRateExchanges[0].rate,
      address: frePrice.fixedRateExchanges[0].id
    }))
  }, [frePrice])

  useEffect(() => {
    if (!poolPrice || poolPrice.pools.length === 0 || price.type !== 'pool')
      return
    setPrice((prevState) => ({
      ...prevState,
      value: poolPrice.pools[0].spotPrice,
      ocean: poolPrice.pools[0].oceanReserve,
      datatoken: poolPrice.pools[0].datatokenReserve
    }))
  }, [poolPrice])

  const fetchDdo = async (token?: CancelToken) => {
    Logger.log('[asset] Init asset, get DDO')
    const ddo = await retrieveDDO(
      asset as string,
      config.metadataCacheUri,
      token
    )

    if (!ddo) {
      setError(
        `[asset] The DDO for ${asset} was not found in MetadataCache. If you just published a new data set, wait some seconds and refresh this page.`
      )
    } else {
      setError(undefined)
    }
    return ddo
  }

  const refreshDdo = async (token?: CancelToken) => {
    const ddo = await fetchDdo(token)
    Logger.debug('[asset] Got DDO', ddo)
    setDDO(ddo)
  }

  //
  // Get and set DDO based on passed DDO or DID
  //
  useEffect(() => {
    if (!asset || !config?.metadataCacheUri) return

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
  }, [asset, config?.metadataCacheUri])

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

    // Set price & metadata from DDO first
    setPrice(ddo.price)
    setVariables({ datatoken: ddo?.dataToken.toLowerCase() })

    // Get metadata from DDO
    const { attributes } = ddo.findServiceByType('metadata')
    setMetadata((attributes as unknown) as MetadataMarket)
    setTitle(attributes?.main.name)
    setOwner(ddo.publicKey[0].owner)
    Logger.log('[asset] Got Metadata from DDO', attributes)

    setIsInPurgatory(ddo.isInPurgatory === 'true')
    await setPurgatory(ddo.id)
  }, [])

  useEffect(() => {
    if (!ddo) return
    initMetadata(ddo)
  }, [ddo, initMetadata])

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
          refreshDdo
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
