import React from 'react'
import { render } from '@testing-library/react'
import Publish from '../../../src/components/pages/Publish'
import content from '../../../content/pages/index.json'

describe('Home', () => {
  it('renders without crashing', () => {
    const { container } = render(<Publish content={content} />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
