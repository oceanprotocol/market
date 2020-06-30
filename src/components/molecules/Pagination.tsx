import React, { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import styles from './Pagination.module.css'

interface PaginationProps {
  totalPages: number
  currentPage: number
  onPageChange(selected: number): void
  hrefBuilder(pageIndex: number): void
}

export default function Pagination({
  totalPages,
  currentPage,
  hrefBuilder,
  onPageChange
}: PaginationProps) {
  const [smallViewport, setSmallViewport] = useState(true)

  function viewportChange(mq: { matches: boolean }) {
    setSmallViewport(!mq.matches)
  }

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 600px)')
    viewportChange(mq)
    mq.addListener(viewportChange)

    return () => {
      mq.removeListener(viewportChange)
    }
  }, [])

  return totalPages > 1 ? (
    <ReactPaginate
      pageCount={totalPages}
      // react-pagination starts counting at 0, we start at 1
      initialPage={currentPage - 1}
      // adapt based on media query match
      marginPagesDisplayed={smallViewport ? 0 : 1}
      pageRangeDisplayed={smallViewport ? 3 : 6}
      onPageChange={(data) => onPageChange(data.selected)}
      hrefBuilder={(pageIndex) => hrefBuilder(pageIndex)}
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
