import React from 'react'
import testRender from '../../../../../.jest/testRender'
import Logo from '@shared/atoms/Logo'
import { Default, WithoutWordmark } from './index.stories'
import { render } from '@testing-library/react'

describe('Logo', () => {
  testRender(<Logo {...Default.args} />)

  it('renders without wordmark', () => {
    render(<Logo {...WithoutWordmark.args} />)
  })
})
