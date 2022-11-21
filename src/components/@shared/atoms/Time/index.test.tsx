import React from 'react'
import testRender from '../../../../../.jest/testRender'
import Time from '@shared/atoms/Time'
import { Default, Relative, IsUnix, Undefined } from './index.stories'
import { render } from '@testing-library/react'

describe('Time', () => {
  testRender(<Time {...Default.args} />)

  it('renders relative time', () => {
    render(<Time {...Relative.args} />)
  })

  it('renders unix time', () => {
    render(<Time {...IsUnix.args} />)
  })

  it('renders undefined', () => {
    render(<Time {...Undefined.args} />)
  })
})
