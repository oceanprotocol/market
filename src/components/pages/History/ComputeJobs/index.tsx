import React, { ReactElement, useEffect, useState } from 'react'
import web3 from 'web3'
import Time from '../../../atoms/Time'
import { Link } from 'gatsby'
import { DDO, Logger, Service, Provider } from '@oceanprotocol/lib'
import { ComputeJobMetaData } from '../../../../@types/ComputeJobMetaData'
import Dotdotdot from 'react-dotdotdot'
import Table from '../../../atoms/Table'
import Button from '../../../atoms/Button'
import { useOcean } from '../../../../providers/Ocean'
import { gql, useQuery } from '@apollo/client'
import { useWeb3 } from '../../../../providers/Web3'
import { queryMetadata } from '../../../../utils/aquarius'
import axios, { CancelToken } from 'axios'
import { ComputeOrders } from '../../../../@types/apollo/ComputeOrders'
import Details from './Details'
import { ComputeJob } from '@oceanprotocol/lib/dist/node/ocean/interfaces/Compute'
import { ReactComponent as Refresh } from '../../../../images/refresh.svg'
import styles from './index.module.css'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'

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
      return <Details job={row} />
    }
  }
]

async function getAssetMetadata(
  queryDtList: string,
  metadataCacheUri: string,
  cancelToken: CancelToken
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

export default function ComputeJobs(): ReactElement {
  const { appConfig } = useSiteMetadata()
  const { ocean, account } = useOcean()
  const { accountId } = useWeb3()
  const [isLoading, setIsLoading] = useState(true)
  const [jobs, setJobs] = useState<ComputeJobMetaData[]>([])
  const { data } = useQuery<ComputeOrders>(getComputeOrders, {
    variables: {
      user: accountId?.toLowerCase()
    }
  })

  async function getJobs() {
    if (!ocean || !account) return

    setIsLoading(true)

    const dtList = []
    const computeJobs: ComputeJobMetaData[] = []
    for (let i = 0; i < data.tokenOrders.length; i++) {
      dtList.push(data.tokenOrders[i].datatokenId.address)
    }
    const queryDtList = JSON.stringify(dtList)
      .replace(/,/g, ' ')
      .replace(/"/g, '')
      .replace(/(\[|\])/g, '')

    try {
      const source = axios.CancelToken.source()
      const assets = await getAssetMetadata(
        queryDtList,
        appConfig.metadataCacheUri,
        source.token
      )
      const providers: Provider[] = []
      const serviceEndpoints: string[] = []
      for (let i = 0; i < data.tokenOrders.length; i++) {
        try {
          const did = web3.utils
            .toChecksumAddress(data.tokenOrders[i].datatokenId.address)
            .replace('0x', 'did:op:')

          const ddo = assets.filter((x) => x.id === did)[0]

          if (!ddo) continue

          const service = ddo.service.filter(
            (x: Service) => x.index === data.tokenOrders[i].serviceId
          )[0]

          if (!service || service.type !== 'compute') continue
          const { serviceEndpoint } = service

          const wasProviderQueried =
            serviceEndpoints.filter((x) => x === serviceEndpoint).length > 0

          if (wasProviderQueried) continue
          serviceEndpoints.push(serviceEndpoint)
        } catch (err) {
          Logger.error(err)
        }
      }

      try {
        for (let i = 0; i < serviceEndpoints.length; i++) {
          const instanceConfig = {
            config,
            web3: config.web3Provider,
            logger: Logger,
            ocean: ocean
          }
          const provider = await Provider.getInstance(instanceConfig)
          await provider.setBaseUrl(serviceEndpoints[i])
          const hasSameCompute =
            providers.filter(
              (x) => x.computeAddress === provider.computeAddress
            ).length > 0
          if (!hasSameCompute) providers.push(provider)
        }
      } catch (err) {
        Logger.error(err)
      }
      for (let i = 0; i < providers.length; i++) {
        try {
          const providerComputeJobs = (await providers[i].computeStatus(
            '',
            account,
            undefined,
            undefined,
            false
          )) as ComputeJob[]

          // means the provider uri is not good, so we ignore it and move on
          if (!providerComputeJobs) continue
          providerComputeJobs.sort((a, b) => {
            if (a.dateCreated > b.dateCreated) {
              return -1
            }
            if (a.dateCreated < b.dateCreated) {
              return 1
            }
            return 0
          })

          for (let j = 0; j < providerComputeJobs.length; j++) {
            const job = providerComputeJobs[j]
            const did = job.inputDID[0]
            const ddo = assets.filter((x) => x.id === did)[0]

            if (!ddo) continue
            const serviceMetadata = ddo.service.filter(
              (x: Service) => x.type === 'metadata'
            )[0]

            const compJob: ComputeJobMetaData = {
              ...job,
              assetName: serviceMetadata.attributes.main.name,
              assetDtSymbol: ddo.dataTokenInfo.symbol
            }
            computeJobs.push(compJob)
          }
        } catch (err) {
          Logger.error(err)
        }
      }
      setJobs(computeJobs)
    } catch (error) {
      Logger.log(error.message)
    } finally {
      setIsLoading(false)
    }
    return true
  }

  useEffect(() => {
    if (data === undefined || !appConfig.metadataCacheUri) {
      setIsLoading(false)
      return
    }
    getJobs()
  }, [ocean, account, data, appConfig.metadataCacheUri])

  return (
    <>
      {jobs.length > 0 && (
        <Button
          style="text"
          size="small"
          title="Refresh compute jobs"
          onClick={() => getJobs()}
          disabled={isLoading}
          className={styles.refresh}
        >
          <Refresh />
          Refresh
        </Button>
      )}
      <Table
        columns={columns}
        data={jobs}
        isLoading={isLoading}
        defaultSortField="row.dateCreated"
        defaultSortAsc={false}
      />
    </>
  )
}
