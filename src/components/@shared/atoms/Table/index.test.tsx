import { render, screen } from '@testing-library/react'
import React from 'react'
import Table, { TableOceanProps } from '.'
import {
  args,
  argsWithPagination,
  argsLoading,
  argsEmpty
} from './index.stories'

describe('Table', () => {
  it('renders without crashing', () => {
    render(<Table {...args} />)
  })

  it('renders WithPagination', () => {
    render(<Table {...argsWithPagination} />)
  })

  it('renders Loading', () => {
    render(<Table {...argsLoading} />)
  })

  it('renders Empty', () => {
    render(<Table {...argsEmpty} />)
    expect(screen.getByText('I am empty')).toBeInTheDocument()
  })

  it('renders Empty without message', () => {
    const args: TableOceanProps<any> = { ...argsEmpty, emptyMessage: undefined }
    render(<Table {...args} />)
    expect(screen.getByText('No results found')).toBeInTheDocument()
  })
})
