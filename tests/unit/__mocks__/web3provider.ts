import web3Mock from './web3'
import React from 'react'
import { Web3ProviderValue } from '@oceanprotocol/react'

export const context = React.createContext<Web3ProviderValue | undefined>({
  web3: web3Mock,
  ethProviderStatus: -1,
  account: '0x0000',
  balance: '',
  chainId: 1,
  web3Connect: {} as any,
  enable: () => null as any
})
export default {
  web3: web3Mock,
  ethProviderStatus: -1,
  account: '0x0000',
  balance: '',
  chainId: 1,
  web3Connect: {} as any,
  enable: () => null as any
}
