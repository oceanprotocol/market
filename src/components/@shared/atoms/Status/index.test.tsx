import React from 'react'
import testRender from '../../../../../.jest/testRender'
import Status from '@shared/atoms/Status'
import { Default } from './index.stories'

describe('Status', () => {
  testRender(<Status {...Default.args} />)
})
