import React, { ReactElement } from 'react'
import Compute from '.'
import ddo from '../../../../../tests/unit/__fixtures__/ddo'
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
  <Compute
    ddo={ddo as DDO}
    dtBalance="1"
    isBalanceSufficient
    file={ddo.service[0].attributes.main.files[0]}
  />
)
