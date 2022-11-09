import React from 'react'
import Table, { TableOceanColumn } from '@shared/atoms/Table'
import AssetTitle from '@shared/AssetListTitle'
import { AssetWithOwnAllocation } from '@utils/veAllocation'

const columns: TableOceanColumn<AssetWithOwnAllocation>[] = [
  {
    name: 'Dataset',
    selector: (row) => {
      const { metadata } = row.asset
      return <AssetTitle title={metadata.name} asset={row.asset} />
    },
    maxWidth: '45rem',
    grow: 1
  },
  {
    name: 'Datatoken Symbol',
    selector: (row) => row.asset.datatokens[0].symbol,
    maxWidth: '10rem'
  },
  {
    name: 'Allocated',
    selector: (row) => row.allocation,
    right: true,
    sortable: true
  }
]

export default function AssetListTable({
  data,
  isLoading
}: {
  data: AssetWithOwnAllocation[]
  isLoading: boolean
}) {
  return (
    <Table
      columns={columns}
      data={data}
      defaultSortFieldId={3}
      sortAsc={false}
      isLoading={isLoading}
      emptyMessage={`Your allocated assets will appear here. [Lock your OCEAN](https://df.oceandao.org) to get started.`}
      noTableHead
    />
  )
}
