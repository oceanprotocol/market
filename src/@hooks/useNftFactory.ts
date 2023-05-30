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

    const config = getOceanConfig(chain.id)
    const factory = new NftFactory(config?.nftFactoryAddress, signer)
    setNftFactory(factory)
  }, [signer, chain?.id])

  return nftFactory
}

export default useNftFactory
