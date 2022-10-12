import React from 'react'
import testRender from '../../../../../.jest/testRender'
import Alert from '@shared/atoms/Alert'

describe('Alert', () => {
  testRender(
    <Alert
      title="Alert Title"
      text="Alert text"
      state="info"
      badge="Hello"
      action={{
        name: 'Hello action',
        style: 'primary',
        handleAction: () => null
      }}
      onDismiss={() => null}
    />
  )
})
