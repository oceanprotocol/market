import React, { ReactElement } from 'react'
import DataTable, { IDataTableProps } from 'react-data-table-component'
import Loader from './Loader'
import styles from './Table.module.css'

interface TableProps extends IDataTableProps {
  isLoading?: boolean
  emptyMessage?: string
}

function Empty({ message }: { message?: string }): ReactElement {
  return <div className={styles.empty}>{message || 'No results found'}</div>
}

export default function Table({
  data,
  columns,
  isLoading,
  emptyMessage,
  ...props
}: TableProps): ReactElement {
  return (
    <DataTable
      columns={columns}
      data={data}
      className={styles.table}
      noHeader
      pagination={data?.length >= 9}
      paginationPerPage={10}
      noDataComponent={<Empty message={emptyMessage} />}
      progressPending={isLoading}
      progressComponent={<Loader />}
      {...props}
    />
  )
}
