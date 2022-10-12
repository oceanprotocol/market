import { columns, data } from '../../../../../.jest/__fixtures__/table'
import { render, screen } from '@testing-library/react'
import React from 'react'
import Table, { TableOceanProps } from '.'

export const args: TableOceanProps<any> = { columns, data }

export const argsWithPagination: TableOceanProps<any> = {
  columns,
  data: data.flatMap((i) => [i, i, i])
}

export const argsLoading: TableOceanProps<any> = {
  isLoading: true,
  columns: [],
  data: []
}

export const argsEmpty: TableOceanProps<any> = {
  emptyMessage: 'I am empty',
  columns: [],
  data: []
}

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
})
