import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import Time from '../../atoms/Time'
import styles from './PoolTransactions.module.css'
import Loader from '../../atoms/Loader'
import Tooltip from '../../atoms/Tooltip'
import Button from '../../atoms/Button'
import ComputeDetailsModal from './ComputeDetailsModal'
import { ComputeJobMetaData } from '@types/ComputeJobMetaData'
import { Link } from 'gatsby'

function DetailsButton({ row }: { row: ComputeJobMetaData }): ReactElement {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Button name="Details" onClick={() => setIsDialogOpen(true)}>
        Details
      </Button>
      <ComputeDetailsModal
        computeJob={row}
        isOpen={isDialogOpen}
        onToggleModal={() => setIsDialogOpen(false)}
      />
    </>
  )
}

function Empty() {
  return <div className={styles.empty}>No results found</div>
}

const columns = [
  {
    name: 'Created',
    selector: function getTimeRow(row: ComputeJobMetaData) {
      return <Time date={row.dateCreated} isUnix />
    }
  },
  {
    name: 'Finished',
    selector: function getTimeRow(row: ComputeJobMetaData) {
      return <Time date={row.dateFinished} isUnix />
    }
  },
  {
    name: 'Name',
    selector: function getAssetRow(row: ComputeJobMetaData) {
      return (
        <Tooltip content={row.assetName}>
          <Link to={`/asset/${row.did}`}>{row.assetName}</Link>{' '}
        </Tooltip>
      )
    }
  },
  {
    name: 'Status',
    selector: function getStatus(row: ComputeJobMetaData) {
      return <>{row.statusText}</>
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

  const getTitle = async (did: string) => {
    const ddo = await ocean.metadatacache.retrieveDDO(did)
    const metadata = ddo.findServiceByType('metadata')
    return metadata.attributes.main.name
  }

  useEffect(() => {
    async function getJobs() {
      if (!ocean || !account) return
      setIsLoading(true)
      try {
        console.log('get jobs')
        const orderHistory = await ocean.assets.getOrderHistory(
          account,
          'compute',
          100
        )
        console.log('orders', orderHistory)
        let jobs: ComputeJobMetaData[] = []

        for (let i = 0; i < orderHistory.length; i++) {
          const assetName = await getTitle(orderHistory[i].did)
          const computeJob = await ocean.compute.status(
            account,
            orderHistory[i].did,
            undefined,
            false
          )
          console.log(computeJob)
          computeJob.forEach((item) => {
            jobs.push({
              did: orderHistory[i].did,
              jobId: item.jobId,
              dateCreated: item.dateCreated,
              dateFinished: item.dateFinished,
              assetName: assetName,
              status: item.status,
              statusText: item.statusText,
              algorithmLogUrl: item.algorithmLogUrl,
              resultsUrls:
                (item as any).resultsUrl !== '' ? (item as any).resultsUrl : []
            })
          })
        }
        console.log(jobs)
        jobs
        setJobs(
          jobs.sort((a, b) => {
            if (a.dateCreated > b.dateCreated) return -1
            if (a.dateCreated < b.dateCreated) return 1
            return 0
          })
        )

        setUserAgreed(true)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    }
    getJobs()
  }, [ocean, account])

  return isLoading ? (
    <Loader />
  ) : (
    <DataTable
      columns={columns}
      data={jobs}
      className={styles.table}
      noHeader
      pagination={jobs?.length >= 9}
      paginationPerPage={10}
      noDataComponent={<Empty />}
    />
  )
}
