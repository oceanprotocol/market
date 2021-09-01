import React, { useState, useEffect, ReactElement } from 'react'
import ReactPaginate from 'react-paginate'
import styles from './Pagination.module.css'
import { ReactComponent as Arrow } from '../../images/arrow.svg'

interface PaginationProps {
  totalPages?: number
  currentPage?: number
  onChangePage?(selected: number): void
  rowsPerPage?: number
  rowCount?: number
}

export default function Pagination({
  totalPages,
  currentPage,
  rowsPerPage,
  rowCount,
  onChangePage
}: PaginationProps): ReactElement {
  const [smallViewport, setSmallViewport] = useState(true)
  const [totalPageNumbers, setTotalPageNumbers] = useState<number>()

  function getTotalPages() {
    if (totalPages) return setTotalPageNumbers(totalPages)
    const doublePageNumber = rowCount / rowsPerPage
    const roundedPageNumber = Math.round(doublePageNumber)
    const total =
      roundedPageNumber < doublePageNumber
        ? roundedPageNumber + 1
        : roundedPageNumber
    setTotalPageNumbers(total)
  }

  function onPageChange(page: number) {
    totalPages ? onChangePage(page) : onChangePage(page + 1)
  }

  function viewportChange(mq: { matches: boolean }) {
    setSmallViewport(!mq.matches)
  }

  useEffect(() => {
    getTotalPages()
  }, [totalPages, rowCount])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 600px)')
    viewportChange(mq)
    mq.addEventListener('change', viewportChange)

    return () => {
      mq.removeEventListener('change', viewportChange)
    }
  }, [])

  return totalPageNumbers && totalPageNumbers > 1 ? (
    <ReactPaginate
      pageCount={totalPageNumbers > 476 ? 476 : totalPageNumbers}
      // react-pagination starts counting at 0, we start at 1
      initialPage={currentPage ? currentPage - 1 : 0}
      // adapt based on media query match
      marginPagesDisplayed={smallViewport ? 0 : 1}
      pageRangeDisplayed={smallViewport ? 3 : 6}
      onPageChange={(data) => onPageChange(data.selected)}
      disableInitialCallback
      previousLabel={<Arrow className={`${styles.arrow} ${styles.previous}`} />}
      nextLabel={<Arrow className={styles.arrow} />}
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
