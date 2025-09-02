import {
  useAppKitProvider,
  useAppKitNetworkCore,
  Provider
} from '@reown/appkit/react'
import { BrowserProvider } from 'ethers'
import { useMemo } from 'react'

export const useProvider = () => {
  const { walletProvider } = useAppKitProvider<Provider>('eip155')
  const { chainId } = useAppKitNetworkCore()

  const provider = useMemo(() => {
    if (!walletProvider || !chainId) return undefined
    return new BrowserProvider(walletProvider, chainId)
  }, [walletProvider, chainId])

  return provider
}
