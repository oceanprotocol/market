import { ComputeJob } from '@oceanprotocol/lib/dist/node/ocean/interfaces/ComputeJob'
import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import Time from '../../atoms/Time'
import styles from './PoolTransactions.module.css'
import Loader from '../../atoms/Loader'
import Button from '../../atoms/Button'
import ComputeDetailsModal from './ComputeDetailsModal'
import { Logger } from '@oceanprotocol/lib'

// function AssetTitle({ row }: { row: ComputeJob }): ReactElement {
//     const { ocean } = useOcean()

//     useEffect(() => {
//         if (!ocean) return

//         async function getDid() {
//             const { did } = await ocean.keeper.agreementStoreManager.getAgreement(
//                 job.agreementId
//             )
//             ocean.

//             const ddo = await ocean.assets.resolve(did)
//         }
//         getDid()
//     }, [ocean, row])
//     return <Link to={`/asset/${did}`}>{title || did}</Link>
// }

function DetailsButton({ row }: { row: ComputeJob }): ReactElement {
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
    selector: function getTimeRow(row: ComputeJob) {
      return <Time date={row.dateCreated} isUnix />
    }
  },
  {
    name: 'Finished',
    selector: function getTimeRow(row: ComputeJob) {
      return <Time date={row.dateFinished} isUnix />
    }
  },
  {
    name: 'Name',
    selector: function getAssetRow() {
      // const did = row.dtAddress.replace('0x', 'did:op:')
      // return <AssetTitle did={did} />
      return <></>
    }
  },
  {
    name: 'Status',
    selector: function getStatus(row: ComputeJob) {
      return <>{row.statusText}</>
    }
  },
  {
    name: 'Actions',
    selector: function getActions(row: ComputeJob) {
      return <DetailsButton row={row} />
    }
  }
]

export default function ComputeJobs(): ReactElement {
  const { ocean, account } = useOcean()
  const [jobs, setJobs] = useState<ComputeJob[]>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!ocean || !account) return

    async function getJobs() {
      setIsLoading(true)
      try {
        const orderHistory = await ocean.assets.getOrderHistory(
          account,
          'compute',
          100
        )
        Logger.log('orders', orderHistory)
        const userJobs = await ocean.compute.status(account)

        setJobs(
          userJobs.sort((a, b) => {
            if (a.dateCreated > b.dateCreated) return -1
            if (a.dateCreated < b.dateCreated) return 1
            return 0
          })
        )
      } catch (e) {
        Logger.error(e.message)
      } finally {
        setIsLoading(false)
      }
    }
    getJobs()
  }, [ocean, account])

  return isLoading ? (
    <Loader />
  ) : account && ocean ? (
    <DataTable
      columns={columns}
      data={jobs}
      className={styles.table}
      noHeader
      pagination={jobs?.length >= 9}
      paginationPerPage={10}
      noDataComponent={<Empty />}
    />
  ) : (
    <div>Connect your wallet to see your compute jobs.</div>
  )
}
