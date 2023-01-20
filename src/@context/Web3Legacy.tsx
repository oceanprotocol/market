// init web3.js object for compatibility with ocean.js

import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactElement,
  ReactNode
} from 'react'
import Web3 from 'web3'
import { LoggerInstance } from '@oceanprotocol/lib'
import { useAccount, useNetwork, useProvider } from 'wagmi'

interface Web3LegacyProviderValue {
  web3: Web3
  web3Loading: boolean
}

const Web3LegacyContext = createContext({} as Web3LegacyProviderValue)

function Web3LegacyProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const web3Provider = useProvider()

  const [web3, setWeb3] = useState<Web3>()
  const [web3Loading, setWeb3Loading] = useState<boolean>(true)

  useEffect(() => {
    if (!web3Provider || !address || !chain?.id) return

    const init = async () => {
      try {
        setWeb3Loading(true)
        const web3 = new Web3(web3Provider as any)
        setWeb3(web3)
      } catch (error) {
        LoggerInstance.error(`[Web3Legacy] ${error.message}`)
      } finally {
        setWeb3Loading(false)
      }
    }
    init()
  }, [web3Provider, address, chain?.id])

  return (
    <Web3LegacyContext.Provider value={{ web3, web3Loading }}>
      {children}
    </Web3LegacyContext.Provider>
  )
}

// Helper hook to access the provider values
const useWeb3Legacy = (): Web3LegacyProviderValue =>
  useContext(Web3LegacyContext)

export { Web3LegacyProvider, useWeb3Legacy, Web3LegacyContext }
export default Web3LegacyProvider
