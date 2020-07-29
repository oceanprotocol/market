import React, { ReactElement } from 'react'
import DataTable from 'react-data-table-component'

export declare type AssetTablePagination = {
  count: number
  rowsPerPage: number
  page: number
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void
  handleChangeRowsPerPage: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >
}

export default function Table({
  columns,
  data,
  pagination
}: {
  columns: any
  data: any
  pagination?: AssetTablePagination
}) {
  return (
    <div>
      {data && data.length ? (
        <DataTable noHeader columns={columns} data={data} />
      ) : (
        <div>No Data Sets Yet.</div>
      )}
    </div>
  )
}
