import { useEffect, useState } from 'react'
import { NftFactory } from '@oceanprotocol/lib'
import { getOceanConfig } from '@utils/ocean'
import { useNetwork, useSigner } from 'wagmi'

function useNftFactory(): NftFactory {
  const { chain } = useNetwork()
  const { data: signer } = useSigner()
  const [nftFactory, setNftFactory] = useState<NftFactory>()

  useEffect(() => {
    if (!signer || !chain?.id) return

    const networkId = chain.id

    const config = getOceanConfig(chain.id)

    if (!config) {
      console.error(`No config found for network ${networkId}`)
      return
    }

    const factory = new NftFactory(config.nftFactoryAddress, signer)
    setNftFactory(factory)
  }, [signer, chain?.id])

  return nftFactory
}

export default useNftFactory
