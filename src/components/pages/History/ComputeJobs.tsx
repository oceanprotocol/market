import { ComputeJob } from '@oceanprotocol/lib/dist/node/ocean/interfaces/ComputeJob'
import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useState } from 'react'
import DataTable from 'react-data-table-component'
import Time from '../../atoms/Time'
import styles from './PoolTransactions.module.css'
import Loader from '../../atoms/Loader'
import Button from '../../atoms/Button'
import ComputeDetailsModal from './ComputeDetailsModal'

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
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
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
      //const did = row.dtAddress.replace('0x', 'did:op:')
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
  const [jobs,setJobs] = useState<ComputeJob[]>()
  const [isLoading, setIsLoading] = useState(false)
  const [userAgreed, setUserAgreed] = useState(false)

  const getJobs = async () => {
    if (!ocean || !account) return
    setIsLoading(true)
    try {
      const orderHistory = await ocean.assets.getOrderHistory(
        account,
        'compute',
        100
      )
      console.log('orders', orderHistory)
       const userJobs = await ocean.compute.status(account)

      setJobs(userJobs.sort((a, b) => {
          if (a.dateCreated > b.dateCreated) return -1
          if (a.dateCreated < b.dateCreated) return 1
          return 0
      }))
      setUserAgreed(true)
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  return isLoading ? (
    <Loader />
  ) : account && ocean ? (
    userAgreed ? (
      <>
        <DataTable
          columns={columns}
          data={jobs}
          className={styles.table}
          noHeader
          pagination={jobs?.length >= 9}
          paginationPerPage={10}
          noDataComponent={<Empty />}
        />
      </>
    ) : (
      <div>
        <Button onClick={getJobs} name="Get jobs">
          Sign to retrieve jobs
        </Button>
      </div>
    )
  ) : (
    <div>Connect your wallet to see your compute jobs.</div>
  )
}
