import React, { ReactElement } from 'react'
import Compute from './Compute'
import ddo from '../../../../tests/unit/__fixtures__/ddo'
import { DDO } from '@oceanprotocol/lib'

export default {
  title: 'Organisms/Compute',
  decorators: [
    (storyFn: () => React.FC): ReactElement => (
      <div style={{ maxWidth: '40rem', margin: 'auto' }}>{storyFn()}</div>
    )
  ]
}

export const Default = (): ReactElement => (
  <Compute ddo={ddo as DDO} isBalanceSufficient />
)
