import React, { ReactElement } from 'react'
import Table, { TableOceanColumn } from '@shared/atoms/Table'
import Time from '@shared/atoms/Time'
import AssetTitle from '@shared/AssetList/AssetListTitle'
import NetworkName from '@shared/NetworkName'
import { useProfile } from '@context/Profile'
import { useUserPreferences } from '@context/UserPreferences'

const columns: TableOceanColumn<DownloadedAsset>[] = [
  {
    name: 'Data Set',
    selector: (row) => <AssetTitle asset={row.asset} />
  },
  {
    name: 'Network',
    selector: (row) => <NetworkName networkId={row.networkId} />
  },
  {
    name: 'Datatoken',
    selector: (row) => row.dtSymbol
  },
  {
    name: 'Time',
    selector: (row) => <Time date={row.timestamp.toString()} relative isUnix />
  }
]

export default function ComputeDownloads({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { downloads, isDownloadsLoading } = useProfile()
  const { chainIds } = useUserPreferences()

  return accountId ? (
    <Table
      columns={columns}
      data={downloads}
      paginationPerPage={10}
      isLoading={isDownloadsLoading}
      emptyMessage={chainIds.length === 0 ? 'No network selected' : null}
    />
  ) : (
    <div>Please connect your Web3 wallet.</div>
  )
}
