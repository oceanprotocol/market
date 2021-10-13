import React, { ReactElement } from 'react'
import Table from '../../../atoms/Table'
import Time from '../../../atoms/Time'
import AssetTitle from '../../../molecules/AssetListTitle'
import NetworkName from '../../../atoms/NetworkName'
import { useProfile } from '../../../../providers/Profile'
import { DownloadedAsset } from '../../../../models/aquarius/DownloadedAsset'
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
