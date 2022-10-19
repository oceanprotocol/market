import { useEffect, useState } from 'react'
import { NftFactory } from '@oceanprotocol/lib'
import { useWeb3 } from '@context/Web3'
import { getOceanConfig } from '@utils/ocean'

function useNftFactory(): NftFactory {
  const { web3, chainId } = useWeb3()
  const [nftFactory, setNftFactory] = useState<NftFactory>()

  useEffect(() => {
    if (!web3 || !chainId) return
    const config = getOceanConfig(chainId)
    const factory = new NftFactory(config?.nftFactoryAddress, web3)
    setNftFactory(factory)
  }, [web3, chainId])

  return nftFactory
}

export default useNftFactory
