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
      web3: null as any,
      web3Modal: null as any,
      web3Provider: null as any,
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
  }
}

export default reactMock
