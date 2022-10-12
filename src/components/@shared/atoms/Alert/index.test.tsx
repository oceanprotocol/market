import React from 'react'
import testRender from '../../../../../.jest/testRender'
import Alert from '@shared/atoms/Alert'
import { render } from '@testing-library/react'

describe('Alert', () => {
  testRender(
    <Alert
      title="Alert Title"
      text="Alert text"
      state="info"
      badge="Hello"
      action={{
        name: 'Hello action',
        style: 'text',
        handleAction: () => null
      }}
      onDismiss={() => null}
    />
  )

  it('renders without action style', () => {
    render(
      <Alert
        text="Alert text"
        state="info"
        action={{
          name: 'Hello action',
          handleAction: () => null
        }}
      />
    )
  })
})
