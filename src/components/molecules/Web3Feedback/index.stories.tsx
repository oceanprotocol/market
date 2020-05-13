import React from 'react'
import Web3Feedback from '.'
import web3Mock from '../../../../tests/unit/__mocks__/web3'
import web3ProviderMock, {
  context
} from '../../../../tests/unit/__mocks__/web3provider'
import { Center } from '../../../../.storybook/helpers'
import { InjectedProviderStatus } from '@oceanprotocol/react'

export default {
  title: 'Molecules/Web3Feedback',
  decorators: [(storyFn: any) => <Center>{storyFn()}</Center>]
}

export const NoWeb3Browser = () => {
  const mock = {
    ...web3ProviderMock,
    web3: null
  } as any

  return (
    <context.Provider value={mock}>
      <Web3Feedback />
    </context.Provider>
  )
}

export const NoAccountConnected = () => {
  const mock = {
    ...web3ProviderMock,
    ethProviderStatus: InjectedProviderStatus.NOT_CONNECTED,
    account: ''
  }
  return (
    <context.Provider value={mock}>
      <Web3Feedback />
    </context.Provider>
  )
}

export const NotConnectedToPacific = () => {
  const mock = {
    ...web3ProviderMock,
    ethProviderStatus: InjectedProviderStatus.CONNECTED,
    account: '0x0000000011111111aaaaaaaabbbbbbbb22222222',
    balance: '11223.748267896',
    web3: {
      ...web3Mock,
      eth: {
        ...web3Mock.eth,
        getChainId: () => Promise.resolve(1)
      }
    }
  }

  return (
    <context.Provider value={mock}>
      <Web3Feedback />
    </context.Provider>
  )
}

export const ErrorConnectingToOcean = () => {
  const mock = {
    ...web3ProviderMock,
    ethProviderStatus: InjectedProviderStatus.CONNECTED,
    account: '0x0000000011111111aaaaaaaabbbbbbbb22222222',
    balance: '11223.748267896',
    web3: {
      ...web3Mock,
      eth: {
        ...web3Mock.eth,
        getChainId: () => Promise.resolve(1)
      }
    }
  }
  return (
    <context.Provider value={mock}>
      <Web3Feedback />
    </context.Provider>
  )
}

export const ErrorInssuficientBalance = () => {
  const mock = {
    ...web3ProviderMock,
    ethProviderStatus: InjectedProviderStatus.CONNECTED,
    account: '0x0000000011111111aaaaaaaabbbbbbbb22222222',
    balance: '11223.748267896'
  }
  return (
    <context.Provider value={mock}>
      <Web3Feedback isBalanceInsufficient />
    </context.Provider>
  )
}

export const ConnectedToOcean = () => {
  const mock = {
    ...web3ProviderMock,
    ethProviderStatus: InjectedProviderStatus.CONNECTED,
    account: '0x0000000011111111aaaaaaaabbbbbbbb22222222',
    balance: '11223.748267896'
  }
  return (
    <context.Provider value={mock}>
      <Web3Feedback />
    </context.Provider>
  )
}
