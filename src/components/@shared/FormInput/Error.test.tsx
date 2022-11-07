import { render, screen } from '@testing-library/react'
import React from 'react'
import Error from './Error'

describe('@shared/FormInput/Error', () => {
  const propsBase = {
    value: '',
    touched: false,
    initialTouched: false
  }

  it('renders without crashing', () => {
    render(<Error meta={{ ...propsBase, error: 'Hello Error' }} />)
    expect(screen.getByText('Hello Error')).toBeInTheDocument()
  })

  it('renders nothing without error passed', () => {
    render(<Error meta={{ ...propsBase }} />)
    expect(screen.queryByText('Hello Error')).not.toBeInTheDocument()
  })
})
