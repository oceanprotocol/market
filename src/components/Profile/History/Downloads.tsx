import React, { ReactElement } from 'react'
import Table from '@shared/atoms/Table'
import Time from '@shared/atoms/Time'
import AssetTitle from '@shared/AssetList/AssetListTitle'
import NetworkName from '@shared/atoms/NetworkName'
import { useProfile } from '@context/Profile'
import { DownloadedAsset } from '@utils/aquarius'
const columns = [
  {
    name: 'Data Set',
    selector: function getAssetRow(row: DownloadedAsset) {
      return <AssetTitle ddo={row.ddo} />
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

  return accountId ? (
    <Table
      columns={columns}
      data={downloads}
      paginationPerPage={10}
      isLoading={isDownloadsLoading}
    />
  ) : (
    <div>Please connect your Web3 wallet.</div>
  )
}
