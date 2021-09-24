import React, { ReactElement, useEffect, useState, useCallback } from 'react'
import Time from '../../../../atoms/Time'
import { Link } from 'gatsby'
import { Logger } from '@oceanprotocol/lib'
import { ComputeJobMetaData } from '../../../../../@types/ComputeJobMetaData'
import Dotdotdot from 'react-dotdotdot'
import Table from '../../../../atoms/Table'
import Button from '../../../../atoms/Button'
import { useOcean } from '../../../../../providers/Ocean'
import { useWeb3 } from '../../../../../providers/Web3'
import Details from './Details'
import { ReactComponent as Refresh } from '../../../../../images/refresh.svg'
import { useUserPreferences } from '../../../../../providers/UserPreferences'
import { getOceanConfig } from '../../../../../utils/ocean'
import NetworkName from '../../../../atoms/NetworkName'
import { getComputeJobs } from '../../../../../utils/compute'
import styles from './index.module.css'
import { useAsset } from '../../../../../providers/Asset'

export function Status({ children }: { children: string }): ReactElement {
  return <div className={styles.status}>{children}</div>
}

const columns = [
  {
    name: 'Data Set',
    selector: function getAssetRow(row: ComputeJobMetaData) {
      return (
        <Dotdotdot clamp={2}>
          <Link to={`/asset/${row.inputDID[0]}`}>{row.assetName}</Link>
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
  const { ocean, account, config, connect } = useOcean()
  const { accountId, networkId } = useWeb3()
  const { ddo } = useAsset()
  const [isLoading, setIsLoading] = useState(true)
  const { chainIds } = useUserPreferences()
  const [jobs, setJobs] = useState<ComputeJobMetaData[]>([])

  const columnsMinimal = [columns[4], columns[5], columns[3]]

  useEffect(() => {
    async function initOcean() {
      const oceanInitialConfig = getOceanConfig(networkId)
      await connect(oceanInitialConfig)
    }
    if (ocean === undefined) {
      initOcean()
    }
  }, [networkId, ocean, connect])

  const fetchJobs = useCallback(async () => {
    if (!chainIds || !accountId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const jobs = await getComputeJobs(chainIds, config, ocean, account, ddo)
      setJobs(jobs)
    } catch (error) {
      Logger.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [account, accountId, chainIds, ddo, config, ocean])

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
