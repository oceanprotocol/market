import React, { ReactElement, useEffect, useState } from 'react'
import Time from '../../atoms/Time'
import styles from './ComputeJobs.module.css'
import Button from '../../atoms/Button'
import ComputeDetails from './ComputeDetails'
import { ComputeJobMetaData } from '../../../@types/ComputeJobMetaData'
import { Link } from 'gatsby'
import { DDO, Logger, ServiceCommon, ServiceCompute } from '@oceanprotocol/lib'
import Dotdotdot from 'react-dotdotdot'
import Table from '../../atoms/Table'
import { useOcean } from '../../../providers/Ocean'
import { gql, useQuery } from '@apollo/client'
import { useWeb3 } from '../../../providers/Web3'
import { queryMetadata } from '../../../utils/aquarius'
import axios, { CancelToken } from 'axios'
import { ComputeOrders } from '../../../@types/apollo/ComputeOrders'
import web3 from 'web3'
import AssetTitle from '../../molecules/AssetListTitle'
const getComputeOrders = gql`
  query ComputeOrders($user: String!) {
    tokenOrders(
      orderBy: timestamp
      orderDirection: desc
      where: { payer: $user }
    ) {
      id
      serviceId
      datatokenId {
        address
      }
      tx
      timestamp
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
    selector: function getAssetRow(row: ComputeAsset) {
      return (
        <Dotdotdot clamp={2}>
          <Link to={`/asset/${row.did}`}>{row.assetName}</Link>
        </Dotdotdot>
      )
    }
  },
  {
    name: 'Created',
    selector: function getTimeRow(row: ComputeAsset) {
      return <Time date={row.dateCreated} isUnix relative />
    }
  },
  {
    name: 'Finished',
    selector: function getTimeRow(row: ComputeAsset) {
      return <Time date={row.dateFinished} isUnix relative />
    }
  },
  {
    name: 'Status',
    selector: function getStatus(row: ComputeAsset) {
      return <Status>{row.statusText}</Status>
    }
  },
  {
    name: 'Actions',
    selector: function getActions(row: ComputeAsset) {
      return <DetailsButton row={row} />
    }
  }
]

async function getAssetMetadata(
  queryDtList: string,
  metadataCacheUri: string,
  cancelToken: CancelToken,
  timestamps: number[]
): Promise<DDO[]> {
  const queryDid = {
    page: 1,
    offset: 100,
    query: {
      query_string: {
        query: `(${queryDtList}) AND service.attributes.main.type:dataset AND service.type:compute`,
        fields: ['dataToken']
      }
    }
  }

  const result = await queryMetadata(queryDid, metadataCacheUri, cancelToken)

  return result.results
}

interface ComputeAsset extends ComputeJobMetaData {
  did: string
  assetName: string
  timestamp: number
  type: string
}

export default function ComputeJobs(): ReactElement {
  const { ocean, account, config } = useOcean()
  const { accountId } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [jobs, setJobs] = useState<ComputeAsset[]>([])
  const { data } = useQuery<ComputeOrders>(getComputeOrders, {
    variables: {
      user: accountId?.toLowerCase()
    }
  })

  useEffect(() => {
    if (data === undefined || !config?.metadataCacheUri) return

    async function getJobs() {
      if (!ocean || !account) return

      setIsLoading(true)

      const dtList = []
      const dtTimestamps = []
      const computeJobs: ComputeAsset[] = []
      for (let i = 0; i < data.tokenOrders.length; i++) {
        dtList.push(data.tokenOrders[i].datatokenId.address)
        dtTimestamps.push(data.tokenOrders[i].timestamp)
      }

      const queryDtList = JSON.stringify(dtList)
        .replace(/,/g, ' ')
        .replace(/"/g, '')
        .replace(/(\[|\])/g, '')

      try {
        const source = axios.CancelToken.source()
        const assets = await getAssetMetadata(
          queryDtList,
          config.metadataCacheUri,
          source.token,
          dtTimestamps
        )
        const providers: ServiceCompute[] = []

        for (let i = 0; i < data.tokenOrders.length; i++) {
          try {
            const did = web3.utils
              .toChecksumAddress(data.tokenOrders[i].datatokenId.address)
              .replace('0x', 'did:op:')

            const ddo = assets.filter((x) => x.id === did)[0]

            if (!ddo) continue

            const service = ddo.service.filter(
              (x: ServiceCommon) => x.index === data.tokenOrders[i].serviceId
            )[0]

            if (!service || service.type !== 'compute') continue
            const { serviceEndpoint } = service

            const wasProviderQueried =
              providers.filter((x) => x.serviceEndpoint === serviceEndpoint)
                .length > 0

            if (wasProviderQueried) continue

            providers.push(service as ServiceCompute)
            // eslint-disable-next-line no-empty
          } catch (err) {
            console.log(err)
          }
        }

        for (let i = 0; i < providers.length; i++) {
          const computeJob = await ocean.compute.status(
            account,
            undefined,
            undefined,
            providers[i],
            undefined,
            undefined,
            false
          )
          computeJob.sort((a, b) => {
            if (a.dateCreated > b.dateCreated) {
              return -1
            }
            if (a.dateCreated < b.dateCreated) {
              return 1
            }
            return 0
          })
          for (let j = 0; j < computeJob.length; j++) {
            const job = computeJob[j]
            const did = job.inputDID[0]

            const ddo = assets.filter((x) => x.id === did)[0]

            if (!ddo) continue
            const serviceMetadata = ddo.service.filter(
              (x: any) => x.type === 'metadata'
            )[0]

            const compJob = {
              did: did,
              jobId: job.jobId,
              dateCreated: job.dateCreated,
              dateFinished: job.dateFinished,
              assetName: serviceMetadata.attributes.main.name,
              status: job.status,
              statusText: job.statusText,
              algorithmLogUrl: '',
              resultsUrls: [],
              timestamp: data.tokenOrders[i].timestamp,
              type: ''
            } as ComputeAsset
            computeJobs.push(compJob)
          }
        }
        setJobs(computeJobs)
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
