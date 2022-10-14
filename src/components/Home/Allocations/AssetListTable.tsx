import React from 'react'
import Table, { TableOceanColumn } from '@shared/atoms/Table'
import AssetTitle from '@shared/AssetList/AssetListTitle'

const columns: TableOceanColumn<AssetExtended>[] = [
  {
    name: 'Dataset',
    selector: (row) => {
      const { metadata } = row
      return <AssetTitle title={metadata.name} asset={row} />
    },
    maxWidth: '45rem',
    grow: 1
  },
  {
    name: 'Datatoken Symbol',
    selector: (row) => row.datatokens[0].symbol,
    maxWidth: '10rem'
  },
  {
    name: 'Allocated',
    // TODO: this needs to be own allocations number
    selector: (row) => row.stats?.allocated,
    right: true
  }
]

export default function AssetListTable({
  data,
  isLoading
}: {
  // TODO: we onlyt need for each asset: name, datatoken symbol, own allocated
  // so this is what we should pass instead of full result response.
  data: AssetExtended[]
  isLoading: boolean
}) {
  return (
    <Table
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyMessage={`Your allocated assets will appear here. [Lock your OCEAN](https://df.oceandao.org) to get started.`}
      noTableHead
    />
  )
}
