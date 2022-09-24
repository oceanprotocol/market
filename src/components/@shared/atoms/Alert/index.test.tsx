import React from 'react'
import testRender from '../../../../../.jest/testRender'
import Alert from '@shared/atoms/Alert'

describe('Alert', () => {
  testRender(<Alert text="Alert text" state="info" />)
})
