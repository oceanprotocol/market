import React, { useState, useEffect, ReactElement } from 'react'
import ReactPaginate from 'react-paginate'
import styles from './Pagination.module.css'

interface PaginationProps {
  rowsPerPage: number
  rowCount: number
  onChangePage(page: number): void
}

export default function Pagination({
  rowsPerPage,
  rowCount,
  onChangePage
}: PaginationProps): ReactElement {
  const [smallViewport, setSmallViewport] = useState(true)
  const doublePageNumber = rowCount / rowsPerPage
  const totalPages =
    Math.round(doublePageNumber) < doublePageNumber
      ? Math.round(doublePageNumber) + 1
      : Math.round(doublePageNumber)

  function viewportChange(mq: { matches: boolean }) {
    setSmallViewport(!mq.matches)
  }

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 600px)')
    viewportChange(mq)
    mq.addEventListener('change', viewportChange)

    return () => {
      mq.removeEventListener('change', viewportChange)
    }
  }, [])

  return totalPages && totalPages > 1 ? (
    <ReactPaginate
      pageCount={totalPages}
      // react-pagination starts counting at 0, we start at 1
      initialPage={0}
      // adapt based on media query match
      marginPagesDisplayed={smallViewport ? 0 : 1}
      pageRangeDisplayed={smallViewport ? 3 : 6}
      onPageChange={(data) => {
        onChangePage(data.selected + 1)
      }}
      disableInitialCallback
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
      containerClassName={styles.pagination}
      pageLinkClassName={styles.number}
      activeLinkClassName={styles.current}
      previousLinkClassName={styles.prev}
      nextLinkClassName={styles.next}
      disabledClassName={styles.prevNextDisabled}
      breakLinkClassName={styles.break}
    />
  ) : null
}
