import React, { ReactElement } from 'react'
import Consume from './Consume'
import ddo from '../../../../tests/unit/__fixtures__/ddo'
import { DDO } from '@oceanprotocol/lib'

export default {
  title: 'Organisms/Consume',
  decorators: [
    (storyFn: () => React.FC): ReactElement => (
      <div style={{ maxWidth: '40rem', margin: 'auto' }}>{storyFn()}</div>
    )
  ]
}

export const PricedAsset = (): ReactElement => (
  <Consume
    ddo={ddo as DDO}
    isBalanceSufficient
    file={new DDO(ddo).findServiceByType('metadata').attributes.main.files[0]}
  />
)
