import { useState, useEffect, useCallback } from 'react'
import { DID, DDO, Metadata, Logger, BestPrice } from '@oceanprotocol/lib'
import { getDataTokenPrice } from '@oceanprotocol/react'
import { useOcean } from '../providers/Ocean'
import { isDDO } from '../providers/Ocean/utils'
import axios, { CancelToken } from 'axios'
import { useWeb3 } from '../providers/Web3'

interface UseMetadata {
  ddo: DDO | undefined
  did: DID | string | undefined
  metadata: Metadata | undefined
  title: string | undefined
  owner: string | undefined
  price: BestPrice | undefined
  getLivePrice: () => Promise<BestPrice>
}

function useMetadata(asset?: DID | string | DDO): UseMetadata {
  const { networkId } = useWeb3()
  const { ocean, config, status } = useOcean()
  const [internalDdo, setDDO] = useState<DDO>()
  const [internalDid, setDID] = useState<DID | string>()
  const [metadata, setMetadata] = useState<Metadata>()
  const [title, setTitle] = useState<string>()
  const [price, setPrice] = useState<BestPrice>()
  const [owner, setOwner] = useState<string>()

  const getDDO = useCallback(
    async (
      did: DID | string,
      cancelToken: CancelToken
    ): Promise<DDO | undefined> => {
      if (!config.metadataCacheUri) return

      const request = await axios.get(
        `${config.metadataCacheUri}/api/v1/aquarius/assets/ddo/${did}`,
        { cancelToken }
      )
      const ddo = request.data as DDO
      return ddo
    },
    [config.metadataCacheUri]
  )

  const getLivePrice = useCallback(async (): Promise<BestPrice> => {
    if (!internalDdo)
      return {
        type: '',
        address: '',
        value: 0,
        ocean: 0,
        datatoken: 0
      } as BestPrice

    const price = await getDataTokenPrice(
      ocean,
      internalDdo.dataToken,
      internalDdo?.price?.type,
      internalDdo.price.pools[0]
    )
    return price
  }, [ocean, internalDdo])

  const getMetadata = useCallback(async (ddo: DDO): Promise<Metadata> => {
    const metadata = ddo.findServiceByType('metadata')
    return metadata.attributes
  }, [])

  //
  // Get and set DDO based on passed DDO or DID
  //
  useEffect(() => {
    if (!asset) return

    const source = axios.CancelToken.source()
    let isMounted = true

    async function init(): Promise<void> {
      if (isDDO(asset as string | DDO | DID)) {
        setDDO(asset as DDO)
        setDID((asset as DDO).id)
      } else {
        // asset is a DID
        const ddo = await getDDO(asset as DID, source.token)
        if (!isMounted) return
        Logger.debug('DDO', ddo)
        setDDO(ddo)
        setDID(asset as DID)
      }
    }
    init()
    return () => {
      isMounted = false
      source.cancel()
    }
  }, [asset, getDDO])

  //
  // Get metadata & price for stored DDO
  //
  useEffect(() => {
    async function init(): Promise<void> {
      if (!internalDdo) return

      // Set price from DDO first
      setPrice(internalDdo.price)

      const metadata = await getMetadata(internalDdo)
      setMetadata(metadata)
      setTitle(metadata.main.name)
      setOwner(internalDdo.publicKey[0].owner)
    }
    init()
  }, [status, networkId, config, internalDdo, getMetadata])

  return {
    ddo: internalDdo,
    did: internalDid,
    metadata,
    title,
    owner,
    price,
    getLivePrice
  }
}

export { useMetadata, UseMetadata }
export default useMetadata
