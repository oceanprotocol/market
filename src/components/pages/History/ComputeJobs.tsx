import React, { ReactElement, useEffect, useState } from 'react'
import Time from '../../atoms/Time'
import styles from './ComputeJobs.module.css'
import Button from '../../atoms/Button'
import ComputeDetails from './ComputeDetails'
import { ComputeJobMetaData } from '../../../@types/ComputeJobMetaData'
import { OrdersData_tokenOrders as OrdersDataTokenOrders } from '../../../@types/apollo/OrdersData'
import { Link } from 'gatsby'
import { Logger } from '@oceanprotocol/lib'
import Dotdotdot from 'react-dotdotdot'
import Table from '../../atoms/Table'
import { useOcean } from '../../../providers/Ocean'
import { gql, useQuery } from '@apollo/client'
import web3 from 'web3'

const getComputeOrders = gql`
  query ComputeOrders($user: String!) {
    tokenOrders(
      orderBy: timestamp
      orderDirection: desc
      where: { payer: $user }
    ) {
      id
      amount
      datatokenId {
        address
      }
      serviceId
      consumer {
        id
      }
      tx
    }
  }
`
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
      return <Time date={row.dateFinished} isUnix relative />
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
  const [computeOrderHistory, setComputeOrderHistory] = useState<
    OrdersDataTokenOrders[]
  >()
  const { data } = useQuery(getComputeOrders, {
    variables: {
      user: '0x4D156A2ef69ffdDC55838176C6712C90f60a2285'.toLowerCase()
      // -------------------------------------------------------------
    }
  })

  console.log('ACCOUNT: ', account)

  useEffect(() => {
    if (data === undefined) return
    console.log('DATA: ', data.tokenOrders)
    // setComputeOrderHistory(data.tokenOrders)

    async function getTitle(did: string) {
      const newDid = web3.utils.toChecksumAddress(did).replace('0x', 'did:op:')
      const ddo = await ocean.metadataCache.retrieveDDO(newDid)
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
        console.log('ORDER HISTORY: ', data.tokenOrders)
        const jobs: ComputeJobMetaData[] = []

        console.log('BEFORE FOR: ', data.tokenOrders.length)
        for (let i = 0; i < data.tokenOrders.length; i++) {
          console.log('DATA[i]: ', data.tokenOrders[i])
          // const assetName = await getTitle(orderHistory[i].did)
          const assetName = await getTitle(
            data.tokenOrders[i].datatokenId.address
          )
          console.log('ASSET NAME: ', assetName)
          const computeJob = await ocean.compute.status(
            account,
            // orderHistory[i].did,
            data.tokenOrders[i].datatokenId.address,
            undefined,
            // orderHistory[i].transactionHash,
            data.tokenOrders[i].tx,
            false
          )
          console.log('COMPUTE JOB: ', computeJob)
          computeJob.forEach((item) => {
            jobs.push({
              did: orderHistory[i].did,
              // did: data.tokenOrders[i].datatokenId.id,
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
          console.log('JOBS: ', jobs)
        }
        const jobsSorted = jobs.sort((a, b) => {
          if (a.dateCreated > b.dateCreated) return -1
          if (a.dateCreated < b.dateCreated) return 1
          return 0
        })
        setJobs(jobsSorted)
      } catch (error) {
        Logger.log(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    getJobs()
  }, [ocean, account, data])

  return (
    <Table
      columns={columns}
      data={jobs}
      isLoading={isLoading}
      defaultSortField="row.dateCreated"
      defaultSortAsc={false}
    />
  )
}
