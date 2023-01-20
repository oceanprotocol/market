import { useEffect, useState } from 'react'
import { NftFactory } from '@oceanprotocol/lib'
import { getOceanConfig } from '@utils/ocean'
import { useNetwork } from 'wagmi'
import { useWeb3Legacy } from '@context/Web3Legacy'

function useNftFactory(): NftFactory {
  const { chain } = useNetwork()
  const { web3 } = useWeb3Legacy()
  const [nftFactory, setNftFactory] = useState<NftFactory>()

  useEffect(() => {
    if (!web3 || !chain?.id) return

    const config = getOceanConfig(chain.id)
    const factory = new NftFactory(config?.nftFactoryAddress, web3)
    setNftFactory(factory)
  }, [web3, chain?.id])

  return nftFactory
}

export default useNftFactory
