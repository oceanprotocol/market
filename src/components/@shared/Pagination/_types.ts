export interface PaginationProps {
  totalPages?: number
  currentPage?: number
  onChangePage?(selected: number): void
  rowsPerPage?: number
  rowCount?: number
}
