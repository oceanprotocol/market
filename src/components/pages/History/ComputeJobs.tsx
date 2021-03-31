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
import { useOcean } from '../../../providers/Ocean'
import { gql, useQuery } from '@apollo/client'
import { useWeb3 } from '../../../providers/Web3'
import { queryMetadata } from '../../../utils/aquarius'
import axios, { CancelToken } from 'axios'

const getComputeOrders = gql`
  query PoolsQuery($user: String!) {
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

async function getAssetDetails(
  queryDtList: string,
  metadataCacheUri: string,
  cancelToken: CancelToken
) {
  const assetList = []

  const queryDid = {
    page: 1,
    offset: 100,
    query: {
      query_string: {
        query: queryDtList,
        fields: ['dataToken']
      }
    }
  }

  const result = await queryMetadata(queryDid, metadataCacheUri, cancelToken)

  for (let i = 0; i < result.results.length; i++) {
    assetList.push({
      did: result.results[i].id,
      assetName: result.results[i].service[0].attributes.main.name,
      type: result.results[i].service[1].type
    })
  }
  return assetList
}

export default function ComputeJobs(): ReactElement {
  const { ocean, account, config } = useOcean()
  const { accountId } = useWeb3()
  const [jobs, setJobs] = useState<ComputeJobMetaData[]>()
  const [isLoading, setIsLoading] = useState(false)

  const { data } = useQuery(getComputeOrders, {
    variables: {
      user: accountId.toLowerCase()
    }
  })

  useEffect(() => {
    if (data === undefined || !config?.metadataCacheUri) return

    async function getJobs() {
      if (!ocean || !account) return

      setIsLoading(true)

      const dtList = []
      for (let i = 0; i < data.tokenOrders.length; i++) {
        dtList.push(data.tokenOrders[i].datatokenId.address)
      }
      const queryDtList = JSON.stringify(dtList)
        .replace(/,/g, ' ')
        .replace(/"/g, '')
        .replace(/(\[|\])/g, '')

      try {
        const source = axios.CancelToken.source()
        const jobs: ComputeJobMetaData[] = []
        const assets = await getAssetDetails(
          queryDtList,
          config.metadataCacheUri,
          source.token
        )

        for (let i = 0; i < assets.length; i++) {
          if (assets[i].type !== 'compute') return

          const computeJob = await ocean.compute.status(
            account,
            assets[i].did,
            undefined,
            data.tokenOrders[i].tx,
            false
          )

          computeJob.forEach((item) => {
            jobs.push({
              did: assets[i].did,
              jobId: item.jobId,
              dateCreated: item.dateCreated,
              dateFinished: item.dateFinished,
              assetName: assets[i].assetName,
              status: item.status,
              statusText: item.statusText,
              algorithmLogUrl: '',
              resultsUrls: []
            })
          })
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
  }, [ocean, account, data, config?.metadataCacheUri])

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
