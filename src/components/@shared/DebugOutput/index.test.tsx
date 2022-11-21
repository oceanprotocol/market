import React from 'react'
import testRender from '../../../../.jest/testRender'
import DebugOutput from './index'

describe('@shared/DebugOutput', () => {
  testRender(<DebugOutput title="Debug" output="Hello Output" />)
})
