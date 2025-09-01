import { useEffect, useState } from 'react'
import { NftFactory } from '@oceanprotocol/lib'
import { getOceanConfig } from '@utils/ocean'
import { useSigner } from './useSigner'
import { useAppKitNetworkCore } from '@reown/appkit/react'

function useNftFactory(): NftFactory {
  const { chainId } = useAppKitNetworkCore()
  const { signer } = useSigner()
  const [nftFactory, setNftFactory] = useState<NftFactory>()

  useEffect(() => {
    if (!signer || !chainId) return

    const networkId = chainId

    const config = getOceanConfig(chainId)

    if (!config) {
      console.error(`No config found for network ${networkId}`)
      return
    }

    const factory = new NftFactory(config.nftFactoryAddress, signer, chainId)
    setNftFactory(factory)
  }, [signer, chainId])

  return nftFactory
}

export default useNftFactory
