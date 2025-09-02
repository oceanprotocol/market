import { useAppKitAccount } from '@reown/appkit/react'
import { useProvider } from './useProvider'
import { useMemo } from 'react'
import { JsonRpcSigner } from 'ethers'

export const useSigner = () => {
  const provider = useProvider()
  const account = useAppKitAccount()

  // Wrap signer creation with useMemo
  const signer = useMemo(() => {
    if (!provider || !account.address) return null
    return new JsonRpcSigner(provider, account.address)
  }, [provider, account.address])

  return { signer }
}
