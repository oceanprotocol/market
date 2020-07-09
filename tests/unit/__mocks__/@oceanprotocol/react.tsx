import React, { ReactElement } from 'react'
import squidMock from './squid'
import web3ProviderMock from '../web3provider'

const reactMock = {
  Web3Provider: function Component({
    children
  }: {
    children: ReactElement
  }): ReactElement {
    return <div>{children}</div>
  },
  OceanProvider: function Component({
    children
  }: {
    children: ReactElement
  }): ReactElement {
    return <div>{children}</div>
  },
  useOcean: () => {
    return {
      ocean: squidMock.ocean
    }
  },
  useWeb3: () => {
    return {
      ...web3ProviderMock,
      account: '0x0000000011111111aaaaaaaabbbbbbbb22222222',
      ethProviderStatus: 1
    }
  },
  useConsume: () => {
    return {
      consume: () => null as any,
      consumeStepText: '',
      isLoading: false
    }
  },
  useCompute: () => {
    return {
      compute: () => null as any,
      isLoading: false,
      computeStepText: 0,
      computeError: ''
    }
  },
  useMetadata: () => {
    return {
      getCuration: () => {
        return Promise.resolve({ rating: 0, numVotes: 0 })
      }
    }
  },
  computeOptions: ['', '']
}

export default reactMock
