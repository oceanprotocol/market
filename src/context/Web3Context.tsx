import React from 'react'
import Web3 from 'web3'
import Core from 'web3connect/lib/core'

export enum InjectedProviderStatus {
  NOT_AVAILABLE = -1,
  NOT_CONNECTED = 0,
  CONNECTED = 1
}

export interface Web3Context {
  web3: null | Web3
  web3Connect: Core
  ethProviderStatus: InjectedProviderStatus
  account: string
  balance: string
}

export const context = React.createContext<Web3Context | undefined>(undefined)
