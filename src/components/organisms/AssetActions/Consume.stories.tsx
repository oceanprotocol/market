import React, { ReactElement } from 'react'
import Consume from './Consume'
import ddo from '../../../../tests/unit/__fixtures__/ddo'
import web3Mock from '../../../../tests/unit/__mocks__/web3'
import { context } from '../../../../tests/unit/__mocks__/web3provider'

export default {
  title: 'Organisms/Consume',
  decorators: [
    (storyFn: () => React.FC): ReactElement => (
      <div style={{ maxWidth: '40rem', margin: 'auto' }}>{storyFn()}</div>
    )
  ]
}

export const PricedAsset = (): ReactElement => (
  <context.Provider value={web3Mock}>
    <Consume
      did={ddo.id}
      metadata={ddo.findServiceByType('metadata').attributes as any}
    />
  </context.Provider>
)
