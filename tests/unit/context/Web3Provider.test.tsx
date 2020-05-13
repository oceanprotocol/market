import React from 'react'
import { render } from '@testing-library/react'
import { Web3Provider } from '@oceanprotocol/react'

describe('Web3Provider', () => {
  it('renders without crashing', () => {
    const { container } = render(<Web3Provider>Children</Web3Provider>)
    expect(container).toHaveTextContent('Children')
  })
})
