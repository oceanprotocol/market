import React from 'react'
import { render } from '@testing-library/react'
import Publish from '../../../src/components/pages/Publish'

describe('Home', () => {
  it('renders without crashing', () => {
    const { container } = render(<Publish />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
