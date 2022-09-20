import React from 'react'
import testRender from '../../../../../.jest/testRender'
import Container from '@shared/atoms/Container'
import { Default } from './index.stories'

describe('Container', () => {
  testRender(<Container {...Default.args} />)
})
