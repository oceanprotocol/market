import React, { ReactElement, useEffect, useState, useCallback } from 'react'
import Time from '@shared/atoms/Time'
import { LoggerInstance } from '@oceanprotocol/lib'
import Table from '@shared/atoms/Table'
import Button from '@shared/atoms/Button'
import { useWeb3 } from '@context/Web3'
import Details from './Details'
import Refresh from '@images/refresh.svg'
import { useUserPreferences } from '@context/UserPreferences'
import NetworkName from '@shared/NetworkName'
import { getComputeJobs } from '@utils/compute'
import styles from './index.module.css'
import { useAsset } from '@context/Asset'
import { useIsMounted } from '@hooks/useIsMounted'
import { useCancelToken } from '@hooks/useCancelToken'
import AssetListTitle from '@shared/AssetList/AssetListTitle'

export function Status({ children }: { children: string }): ReactElement {
  return <div className={styles.status}>{children}</div>
}

const columns = [
  {
    name: 'Data Set',
    selector: function getAssetRow(row: ComputeJobMetaData) {
      return <AssetListTitle did={row.inputDID[0]} title={row.assetName} />
    }
  },
  {
    name: 'Network',
    selector: function getNetwork(row: ComputeJobMetaData) {
      return <NetworkName networkId={row.networkId} />
    }
  },
  {
    name: 'Created',
    selector: function getTimeRow(row: ComputeJobMetaData) {
      return <Time date={row.dateCreated} isUnix relative />
    }
  },
  {
    name: 'Finished',
    selector: function getTimeRow(row: ComputeJobMetaData) {
      return row.dateFinished ? (
        <Time date={row.dateFinished} isUnix relative />
      ) : (
        ''
      )
    }
  },
  {
    name: 'Status',
    selector: function getStatus(row: ComputeJobMetaData) {
      return <Status>{row.statusText}</Status>
    }
  },
  {
    name: 'Actions',
    selector: function getActions(row: ComputeJobMetaData) {
      return <Details job={row} />
    }
  }
]

export default function ComputeJobs({
  minimal,
  assetChainIds,
  refetchJobs
}: {
  minimal?: boolean
  assetChainIds?: number[]
  refetchJobs?: boolean
}): ReactElement {
  const { accountId } = useWeb3()
  const { asset } = useAsset()
  const { chainIds } = useUserPreferences()
  const isMounted = useIsMounted()
  const newCancelToken = useCancelToken()

  const [isLoading, setIsLoading] = useState(false)
  const [jobs, setJobs] = useState<ComputeJobMetaData[]>([])
  const [columnsMinimal] = useState([columns[4], columns[5], columns[3]])

  const fetchJobs = useCallback(async () => {
    if (!chainIds || chainIds.length === 0 || !accountId) {
      setJobs([])
      setIsLoading(false)
      return
    }
    try {
      setIsLoading(true)
      const jobs = await getComputeJobs(
        assetChainIds || chainIds,
        accountId,
        asset,
        newCancelToken()
      )
      isMounted() && setJobs(jobs.computeJobs)
      setIsLoading(!jobs.isLoaded)
    } catch (error) {
      LoggerInstance.error(error.message)
    }
  }, [chainIds, accountId, asset, isMounted, assetChainIds, newCancelToken])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs, refetchJobs])

  return accountId ? (
    <>
      {jobs?.length >= 0 && !minimal && (
        <Button
          style="text"
          size="small"
          title="Refresh compute jobs"
          onClick={async () => await fetchJobs()}
          disabled={isLoading}
          className={styles.refresh}
        >
          <Refresh />
          Refresh
        </Button>
      )}
      <Table
        columns={minimal ? columnsMinimal : columns}
        data={jobs}
        isLoading={isLoading}
        defaultSortField="row.dateCreated"
        defaultSortAsc={false}
        emptyMessage={chainIds.length === 0 ? 'No network selected' : null}
      />
    </>
  ) : (
    <div>Please connect your Web3 wallet.</div>
  )
}
