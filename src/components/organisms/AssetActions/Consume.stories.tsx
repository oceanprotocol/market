import React from 'react'
import Consume from './Consume'
import ddo from '../../../../tests/unit/__fixtures__/ddo'
import web3Mock from '../../../../tests/unit/__mocks__/web3'
import { DDO } from '@oceanprotocol/squid'
import { context } from '../../../../tests/unit/__mocks__/web3provider'

export default {
  title: 'Organisms/Consume',
  decorators: [
    (storyFn: () => React.FC) => (
      <div style={{ maxWidth: '40rem', margin: 'auto' }}>{storyFn()}</div>
    )
  ]
}

export const PricedAsset = () => (
  <context.Provider value={web3Mock}>
    <Consume ddo={ddo as DDO} />
  </context.Provider>
)
