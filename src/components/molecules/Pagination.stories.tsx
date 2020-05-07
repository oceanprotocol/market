import React from 'react'
import Pagination from './Pagination'

export default {
  title: 'Molecules/Pagination'
}

const defaultProps = {
  hrefBuilder: () => null as any,
  onPageChange: () => null as any
}

export const Normal = () => (
  <Pagination totalPages={20} currentPage={1} {...defaultProps} />
)

export const FewPages = () => (
  <Pagination totalPages={3} currentPage={1} {...defaultProps} />
)

export const LotsOfPages = () => (
  <Pagination totalPages={300} currentPage={1} {...defaultProps} />
)
