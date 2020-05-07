import React from 'react'
import { render } from '@testing-library/react'
import Layout from '../../src/Layout'

describe('Layout', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Layout title="Hello" description="Hello">
        Hello
      </Layout>
    )
    expect(container.firstChild).toBeInTheDocument()
  })
})
