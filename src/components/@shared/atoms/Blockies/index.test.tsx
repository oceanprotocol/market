import React from 'react'
import testRender from '../../../../../.jest/testRender'
import Blockies from '@shared/atoms/Blockies'
import { Default } from './index.stories'

describe('Blockies', () => {
  testRender(<Blockies {...Default.args} />)
})
