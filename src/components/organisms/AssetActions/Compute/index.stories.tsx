import React, { ReactElement } from 'react'
import Compute from '.'
import ddo from '../../../../../tests/unit/__fixtures__/ddo'

export default {
  title: 'Organisms/Compute',
  decorators: [
    (storyFn: () => React.FC): ReactElement => (
      <div style={{ maxWidth: '40rem', margin: 'auto' }}>{storyFn()}</div>
    )
  ]
}

export const Default = (): ReactElement => (
  <Compute dtBalance="1" file={ddo.service[0].attributes.main.files[0]} />
)
