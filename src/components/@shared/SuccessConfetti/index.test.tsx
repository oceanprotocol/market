import { render } from '@testing-library/react'
import React from 'react'
import testRender from '../../../../.jest/testRender'
import SuccessConfetti from './index'

describe('@shared/SuccessConfetti', () => {
  testRender(<SuccessConfetti success="Nice Success!" />)

  it('renders without success', () => {
    render(<SuccessConfetti success={null} />)
  })
})
