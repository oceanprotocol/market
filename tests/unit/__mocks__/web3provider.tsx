import web3Mock from './web3'
import React, { useContext, createContext } from 'react'
import { Web3ProviderValue } from '@oceanprotocol/react'

const valueMock = {
  web3: web3Mock,
  ethProviderStatus: -1,
  account: '0x0000',
  balance: '',
  chainId: 1,
  web3Connect: {} as any,
  enable: () => null as any
}

const Web3ContextMock = React.createContext<Web3ProviderValue>(valueMock)

// TODO: this will have to be updated to web3modal
function Web3ProviderMock({ children }: { children: any }): any {
  return (
    <Web3ContextMock.Provider value={valueMock}>
      {children}
    </Web3ContextMock.Provider>
  )
}

// Helper hook to access the provider values
const useWeb3 = (): Web3ProviderValue => useContext(Web3ContextMock)

export { Web3ProviderMock, useWeb3 }
export default Web3ProviderMock
