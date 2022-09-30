import React from 'react'
import testRender from '../../../../../.jest/testRender'
import Time from '@shared/atoms/Time'
import { Default } from './index.stories'

describe('Time', () => {
  testRender(<Time {...Default.args} />)
})
