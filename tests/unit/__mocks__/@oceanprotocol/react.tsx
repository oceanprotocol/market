import React, { ReactElement } from 'react'
import libMock from './lib'

const reactMock = {
  OceanProvider: function Component({
    children
  }: {
    children: ReactElement
  }): ReactElement {
    return <div>{children}</div>
  },
  useOcean: () => {
    return {
      ocean: libMock.ocean,
      config: {},
      web3: null,
      web3Modal: null,
      web3Provider: null,
      accountId: '0x0000000011111111aaaaaaaabbbbbbbb22222222',
      balance: '0.12'
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
