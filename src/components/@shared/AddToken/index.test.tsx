import React from 'react'
import testRender from '../../../../.jest/testRender'
import AddToken from './index'

describe('@shared/AddToken', () => {
  testRender(
    <AddToken
      address="0xd8992Ed72C445c35Cb4A2be468568Ed1079357c8"
      symbol="OCEAN"
    />
  )
})
