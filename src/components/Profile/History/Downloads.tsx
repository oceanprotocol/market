import React, { ReactElement } from 'react'
import Table from '@shared/atoms/Table'
import Time from '@shared/atoms/Time'
import AssetTitle from '@shared/AssetList/AssetListTitle'
import NetworkName from '@shared/NetworkName'
import { useProfile } from '@context/Profile'
import { useUserPreferences } from '@context/UserPreferences'
const columns = [
  {
    name: 'Data Set',
    selector: function getAssetRow(row: DownloadedAsset) {
      return <AssetTitle asset={row.asset} />
    }
  },
  {
    name: 'Network',
    selector: function getNetwork(row: DownloadedAsset) {
      return <NetworkName networkId={row.networkId} />
    }
  },
  {
    name: 'Datatoken',
    selector: function getTitleRow(row: DownloadedAsset) {
      return row.dtSymbol
    }
  },
  {
    name: 'Time',
    selector: function getTimeRow(row: DownloadedAsset) {
      return <Time date={row.timestamp.toString()} relative isUnix />
    }
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
