import React, { ReactElement } from 'react'
import DataTable, { TableProps, TableColumn } from 'react-data-table-component'
import Loader from '../Loader'
import Pagination from '@shared/Pagination'
import { PaginationComponent } from 'react-data-table-component/dist/src/DataTable/types'
import Empty from './Empty'
import { customStyles } from './_styles'

// Hack in support for returning components for each row, as this works,
// but is not supported by the typings.
export interface TableOceanColumn<T> extends TableColumn<T> {
  selector?: (row: T) => any
}

export interface TableOceanProps<T> extends TableProps<T> {
  columns: TableOceanColumn<T>[]
  isLoading?: boolean
  emptyMessage?: string
  sortField?: string
  sortAsc?: boolean
  className?: string
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
}: TableOceanProps<any>): ReactElement {
  return (
    <div className={className}>
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination || data?.length >= 9}
        paginationPerPage={paginationPerPage || 10}
        noDataComponent={<Empty message={emptyMessage} />}
        progressPending={isLoading}
        progressComponent={<Loader />}
        paginationComponent={Pagination as unknown as PaginationComponent}
        defaultSortFieldId={sortField}
        defaultSortAsc={sortAsc}
        theme="ocean"
        customStyles={customStyles}
        {...props}
      />
    </div>
  )
}
