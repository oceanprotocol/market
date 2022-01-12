import React, { ReactElement, useEffect, useState, useCallback } from 'react'
import Time from '@shared/atoms/Time'
import Link from 'next/link'
import { LoggerInstance } from '@oceanprotocol/lib'
import Dotdotdot from 'react-dotdotdot'
import Table from '@shared/atoms/Table'
import Button from '@shared/atoms/Button'
import { useOcean } from '@context/Ocean'
import { useWeb3 } from '@context/Web3'
import Details from './Details'
import Refresh from '@images/refresh.svg'
import { useUserPreferences } from '@context/UserPreferences'
import { getOceanConfig } from '@utils/ocean'
import NetworkName from '@shared/NetworkName'
// import { getComputeJobs } from '@utils/compute'
import styles from './index.module.css'
import { useAsset } from '@context/Asset'
import { useIsMounted } from '@hooks/useIsMounted'

export function Status({ children }: { children: string }): ReactElement {
  return <div className={styles.status}>{children}</div>
}

const columns = [
  {
    name: 'Data Set',
    selector: function getAssetRow(row: ComputeJobMetaData) {
      return (
        <Dotdotdot clamp={2}>
          <Link href={`/asset/${row.inputDID[0]}`}>
            <a>{row.assetName}</a>
          </Link>
        </Dotdotdot>
      )
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
  minimal
}: {
  minimal?: boolean
}): ReactElement {
  const { config } = useOcean()
  const { accountId, networkId } = useWeb3()
  const { ddo } = useAsset()
  const [isLoading, setIsLoading] = useState(false)
  const { chainIds } = useUserPreferences()
  const [jobs, setJobs] = useState<ComputeJobMetaData[]>([])
  const isMounted = useIsMounted()

  const columnsMinimal = [columns[4], columns[5], columns[3]]

  // useEffect(() => {
  //   async function initOcean() {
  //     const oceanInitialConfig = getOceanConfig(networkId)
  //     await connect(oceanInitialConfig)
  //   }
  //   if (ocean === undefined) {
  //     initOcean()
  //   }
  // }, [networkId])

  const fetchJobs = useCallback(async () => {
    if (!chainIds || chainIds.length === 0 || !accountId) {
      setJobs([])
      setIsLoading(false)
      return
    }
    try {
      setIsLoading(true)
      // const jobs = await getComputeJobs(chainIds, config, ocean, account, ddo)
      // isMounted() && setJobs(jobs.computeJobs)
      // setIsLoading(jobs.isLoaded)
    } catch (error) {
      LoggerInstance.error(error.message)
    }
  }, [chainIds, accountId, config, ddo, isMounted])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

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
      />
    </>
  ) : (
    <div>Please connect your Web3 wallet.</div>
  )
}
