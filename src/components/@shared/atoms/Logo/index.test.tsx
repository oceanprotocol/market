import React from 'react'
import testRender from '../../../../../.jest/testRender'
import Logo from '@shared/atoms/Logo'
import { Default } from './index.stories'

describe('Logo', () => {
  testRender(<Logo {...Default.args} />)
})
