import React, { ReactElement } from 'react'
import DataTable, { IDataTableProps } from 'react-data-table-component'
import Loader from './Loader'
import styles from './Table.module.css'

interface TableProps extends IDataTableProps {
  isLoading?: boolean
}

function Empty(): ReactElement {
  return <div className={styles.empty}>No results found</div>
}

export default function Table({
  data,
  columns,
  isLoading
}: TableProps): ReactElement {
  return (
    <DataTable
      columns={columns}
      data={data}
      className={styles.table}
      noHeader
      pagination={data?.length >= 9}
      paginationPerPage={10}
      noDataComponent={<Empty />}
      progressPending={isLoading}
      progressComponent={<Loader />}
    />
  )
}
