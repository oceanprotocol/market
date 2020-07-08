import React from 'react'
import Compute from './Compute'
import ddo from '../../../../tests/unit/__fixtures__/ddo'
import web3Mock from '../../../../tests/unit/__mocks__/web3'
import { DDO } from '@oceanprotocol/squid'
import oceanMock from '../../../tests/unit/__mocks__/ocean-mock'
import { context } from '../../../../tests/unit/__mocks__/web3provider'

export default {
  title: 'Organisms/Consumejob',
  decorators: [
    (storyFn: () => React.FC) => (
      <div style={{ maxWidth: '40rem', margin: 'auto' }}>{storyFn()}</div>
    )
  ]
}

export const Default = () => (
  <context.Provider value={web3Mock}>
    <Compute ddo={ddo as DDO} ocean={oceanMock as any} balance="1000000" />
  </context.Provider>
)
