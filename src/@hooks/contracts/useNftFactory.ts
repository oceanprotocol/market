import { useEffect, useState } from 'react'
import { NftFactory } from '@oceanprotocol/lib'
import { useWeb3 } from '@context/Web3'

function useNftFactory(): NftFactory {
  const { web3, chainId } = useWeb3()
  const [nftFactory, setNftFactory] = useState<NftFactory>()

  useEffect(() => {
    if (!web3 || !chainId) return

    const factory = new NftFactory(
      '0xa15024b732A8f2146423D14209eFd074e61964F3',
      web3
    )
    setNftFactory(factory)
  }, [web3, chainId])

  return nftFactory
}

export default useNftFactory
