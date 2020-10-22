import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import Time from '../../atoms/Time'
import styles from './ComputeJobs.module.css'
import Button from '../../atoms/Button'
import ComputeDetails from './ComputeDetails'
import { ComputeJobMetaData } from '../../../@types/ComputeJobMetaData'
import { Link } from 'gatsby'
import { Logger } from '@oceanprotocol/lib'
import Dotdotdot from 'react-dotdotdot'
import Table from '../../atoms/Table'

function DetailsButton({ row }: { row: ComputeJobMetaData }): ReactElement {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Button style="text" size="small" onClick={() => setIsDialogOpen(true)}>
        Show Details
      </Button>
      <ComputeDetails
        computeJob={row}
        isOpen={isDialogOpen}
        onToggleModal={() => setIsDialogOpen(false)}
      />
    </>
  )
}

export function Status({ children }: { children: string }): ReactElement {
  return <div className={styles.status}>{children}</div>
}

const columns = [
  {
    name: 'Data Set',
    selector: function getAssetRow(row: ComputeJobMetaData) {
      return (
        <Dotdotdot clamp={2}>
          <Link to={`/asset/${row.did}`}>{row.assetName}</Link>
        </Dotdotdot>
      )
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
      return <Time date={row.dateFinished} isUnix />
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
      return <DetailsButton row={row} />
    }
  }
]

export default function ComputeJobs(): ReactElement {
  const { ocean, account } = useOcean()
  const [jobs, setJobs] = useState<ComputeJobMetaData[]>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function getTitle(did: string) {
      const ddo = await ocean.metadatacache.retrieveDDO(did)
      const metadata = ddo.findServiceByType('metadata')
      return metadata.attributes.main.name
    }

    async function getJobs() {
      if (!ocean || !account) return
      setIsLoading(true)
      try {
        const orderHistory = await ocean.assets.getOrderHistory(
          account,
          'compute',
          100
        )
        const jobs: ComputeJobMetaData[] = []

        for (let i = 0; i < orderHistory.length; i++) {
          const assetName = await getTitle(orderHistory[i].did)
          const computeJob = await ocean.compute.status(
            account,
            orderHistory[i].did,
            undefined,
            orderHistory[i].transactionHash,
            false
          )
          computeJob.forEach((item) => {
            jobs.push({
              did: orderHistory[i].did,
              jobId: item.jobId,
              dateCreated: item.dateCreated,
              dateFinished: item.dateFinished,
              assetName: assetName,
              status: item.status,
              statusText: item.statusText,
              algorithmLogUrl: '',
              resultsUrls: []
            })
          })
        }
        setJobs(
          jobs.sort((a, b) => {
            if (a.dateCreated > b.dateCreated) return -1
            if (a.dateCreated < b.dateCreated) return 1
            return 0
          })
        )
      } catch (error) {
        Logger.log(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    getJobs()
  }, [ocean, account])

  return <Table columns={columns} data={jobs} isLoading={isLoading} />
}
