import React from 'react'
import testRender from '../../../../../.jest/testRender'
import Loader from '@shared/atoms/Loader'
import { Default } from './index.stories'

describe('Loader', () => {
  testRender(<Loader {...Default.args} />)
})
