import React, { ReactElement } from 'react'
import DataTable, { IDataTableProps } from 'react-data-table-component'
import Loader from './Loader'
import Pagination from '../molecules/Pagination'
import styles from './Table.module.css'
import { useUserPreferences } from '../../providers/UserPreferences'

interface TableProps extends IDataTableProps {
  isLoading?: boolean
  emptyMessage?: string
  sortField?: string
  sortAsc?: boolean
  className?: string
}

function Empty({ message }: { message?: string }): ReactElement {
  const { chainIds } = useUserPreferences()
  return (
    <div className={styles.empty}>
      {chainIds.length === 0
        ? 'No network selected'
        : message || 'No results found'}
    </div>
  )
}

export default function Table({
  data,
  columns,
  isLoading,
  emptyMessage,
  pagination,
  paginationPerPage,
  sortField,
  sortAsc,
  className,
  ...props
}: TableProps): ReactElement {
  return (
    <DataTable
      columns={columns}
      data={data}
      className={className ? styles.table + ` ${className}` : styles.table}
      noHeader
      pagination={pagination || data?.length >= 9}
      paginationPerPage={paginationPerPage || 10}
      noDataComponent={<Empty message={emptyMessage} />}
      progressPending={isLoading}
      progressComponent={<Loader />}
      paginationComponent={Pagination}
      defaultSortField={sortField}
      defaultSortAsc={sortAsc}
      {...props}
    />
  )
}
