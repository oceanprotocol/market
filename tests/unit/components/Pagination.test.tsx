import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Pagination from '../../../src/components/molecules/Pagination'

const defaultProps = {
  hrefBuilder: () => null as any,
  onPageChange: () => null as any
}

describe('Pagination', () => {
  it('renders without crashing', () => {
    const { getByText, container } = render(
      <Pagination totalPages={20} currentPage={1} {...defaultProps} />
    )
    expect(container.firstChild).toBeInTheDocument()
    container.firstChild && expect(container.firstChild.nodeName).toBe('UL')

    // interact with page links
    const pageLink = getByText('2')
    fireEvent.click(pageLink)
  })

  it('renders nothing when no pages', () => {
    const { container } = render(
      <Pagination totalPages={1} currentPage={1} {...defaultProps} />
    )
    expect(container.firstChild).not.toBeInTheDocument()
  })
})
