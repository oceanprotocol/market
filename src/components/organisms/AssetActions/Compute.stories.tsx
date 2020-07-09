import React, { ReactElement } from 'react'
import Compute from './Compute'
import ddo from '../../../../tests/unit/__fixtures__/ddo'
import web3Mock from '../../../../tests/unit/__mocks__/web3'
import squidMock from '../../../../tests/unit/__mocks__/@oceanprotocol/squid'
import { context } from '../../../../tests/unit/__mocks__/web3provider'

export default {
  title: 'Organisms/Consume',
  decorators: [
    (storyFn: () => React.FC): ReactElement => (
      <div style={{ maxWidth: '40rem', margin: 'auto' }}>{storyFn()}</div>
    )
  ]
}

export const Default = (): ReactElement => (
  <context.Provider value={web3Mock}>
    <Compute
      did={ddo.id}
      ocean={squidMock.ocean as any}
      metadata={ddo.findServiceByType('metadata').attributes as any}
      balance="1000000"
    />
  </context.Provider>
)
