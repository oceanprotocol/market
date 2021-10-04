import {
  ServiceComputePrivacy,
  publisherTrustedAlgorithm as PublisherTrustedAlgorithm,
  DDO,
  Service,
  Logger,
  Provider,
  Config,
  Ocean,
  Account
} from '@oceanprotocol/lib'
import { ComputePrivacyForm } from '../models/FormEditComputeDataset'
import web3 from 'web3'
import { ComputeJob } from '@oceanprotocol/lib/dist/node/ocean/interfaces/Compute'
import axios, { CancelToken } from 'axios'
import { gql } from 'urql'
import { ComputeJobMetaData } from '../@types/ComputeJobMetaData'
import { transformChainIdsListToQuery, queryMetadata } from './aquarius'
import { fetchDataForMultipleChains } from './subgraph'
import { OrdersData_tokenOrders_datatokenId as OrdersDatatoken } from '../@types/apollo/OrdersData'

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

const getComputeOrdersByDatatokenAddress = gql`
  query ComputeOrdersByDatatokenAddress(
    $user: String!
    $datatokenAddress: String!
  ) {
    tokenOrders(
      orderBy: timestamp
      orderDirection: desc
      where: { payer: $user, datatokenId: $datatokenAddress }
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

interface TokenOrder {
  id: string
  serviceId: number
  datatokenId: OrdersDatatoken
  tx: any
  timestamp: number
}

interface ComputeResults {
  computeJobs: ComputeJobMetaData[]
  isLoaded: boolean
}

async function getAssetMetadata(
  queryDtList: string,
  cancelToken: CancelToken,
  chainIds: number[]
): Promise<DDO[]> {
  const queryDid = {
    query: {
      query_string: {
        query: `(${queryDtList}) AND (${transformChainIdsListToQuery(
          chainIds
        )}) AND service.attributes.main.type:dataset AND service.type:compute`,
        fields: ['dataToken']
      }
    }
  }

  const result = await queryMetadata(queryDid, cancelToken)
  return result.results
}

function getServiceEndpoints(data: TokenOrder[], assets: DDO[]): string[] {
  const serviceEndpoints: string[] = []

  for (let i = 0; i < data.length; i++) {
    try {
      const did = web3.utils
        .toChecksumAddress(data[i].datatokenId.address)
        .replace('0x', 'did:op:')
      const ddo = assets.filter((x) => x.id === did)[0]
      if (ddo === undefined) continue

      const service = ddo.service.filter(
        (x: Service) => x.index === data[i].serviceId
      )[0]

      if (!service || service.type !== 'compute') continue
      const { serviceEndpoint } = service

      const wasProviderQueried =
        serviceEndpoints?.filter((x) => x === serviceEndpoint).length > 0

      if (wasProviderQueried) continue
      serviceEndpoints.push(serviceEndpoint)
    } catch (err) {
      Logger.error(err.message)
    }
  }

  return serviceEndpoints
}

async function getProviders(
  serviceEndpoints: string[],
  config: Config,
  ocean: Ocean
): Promise<Provider[]> {
  const providers: Provider[] = []

  try {
    for (let i = 0; i < serviceEndpoints?.length; i++) {
      const instanceConfig = {
        config,
        web3: config.web3Provider,
        logger: Logger,
        ocean
      }
      const provider = await Provider.getInstance(instanceConfig)
      await provider.setBaseUrl(serviceEndpoints[i])
      const hasSameCompute =
        providers.filter((x) => x.computeAddress === provider.computeAddress)
          .length > 0
      if (!hasSameCompute) providers.push(provider)
    }
  } catch (err) {
    Logger.error(err.message)
  }

  return providers
}

async function getJobs(
  providers: Provider[],
  account: Account,
  assets: DDO[]
): Promise<ComputeJobMetaData[]> {
  const computeJobs: ComputeJobMetaData[] = []

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

      for (let j = 0; j < providerComputeJobs?.length; j++) {
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
          assetDtSymbol: ddo.dataTokenInfo.symbol,
          networkId: ddo.chainId
        }
        computeJobs.push(compJob)
      }
    } catch (err) {
      Logger.error(err.message)
    }
  }

  return computeJobs
}

function getDtList(data: TokenOrder[]) {
  const dtList = []

  for (let i = 0; i < data.length; i++) {
    dtList.push(data[i].datatokenId.address)
  }
  const queryDtList = JSON.stringify(dtList)
    .replace(/,/g, ' ')
    .replace(/"/g, '')
    .replace(/(\[|\])/g, '')

  return queryDtList
}

export async function getComputeJobs(
  chainIds: number[],
  config: Config,
  ocean: Ocean,
  account: Account,
  ddo?: DDO
): Promise<ComputeResults> {
  const assetDTAddress = ddo?.dataTokenInfo?.address
  let computeResult: ComputeResults = {
    computeJobs: [],
    isLoaded: false
  }
  let isLoading = true
  const variables = assetDTAddress
    ? {
        user: account?.getId().toLowerCase(),
        datatokenAddress: assetDTAddress.toLowerCase()
      }
    : {
        user: account?.getId().toLowerCase()
      }

  const result = await fetchDataForMultipleChains(
    assetDTAddress ? getComputeOrdersByDatatokenAddress : getComputeOrders,
    variables,
    assetDTAddress ? [ddo?.chainId] : chainIds
  )
  let data: TokenOrder[] = []
  for (let i = 0; i < result.length; i++) {
    if (!result[i]?.tokenOrders || result[i].tokenOrders.length === 0) continue
    result[i]?.tokenOrders.forEach((tokenOrder: TokenOrder) => {
      data.push(tokenOrder)
    })
  }
  if (!ocean || !account || !data) {
    isLoading = false
    return
  }

  data = data.sort((a, b) => b.timestamp - a.timestamp)
  const queryDtList = getDtList(data)
  if (queryDtList === '') return

  const source = axios.CancelToken.source()
  const assets = await getAssetMetadata(queryDtList, source.token, chainIds)
  const serviceEndpoints = getServiceEndpoints(data, assets)
  const providers: Provider[] = await getProviders(
    serviceEndpoints,
    config,
    ocean
  )
  const computeJobs = await getJobs(providers, account, assets)
  isLoading = false
  computeResult = {
    computeJobs: computeJobs,
    isLoaded: isLoading
  }

  return computeResult
}

export async function createTrustedAlgorithmList(
  selectedAlgorithms: string[], // list of DIDs
  ocean: Ocean
): Promise<PublisherTrustedAlgorithm[]> {
  const trustedAlgorithms = []

  for (const selectedAlgorithm of selectedAlgorithms) {
    const trustedAlgorithm =
      await ocean.compute.createPublisherTrustedAlgorithmfromDID(
        selectedAlgorithm
      )
    trustedAlgorithms.push(trustedAlgorithm)
  }
  return trustedAlgorithms
}

export async function transformComputeFormToServiceComputePrivacy(
  values: ComputePrivacyForm,
  ocean: Ocean
): Promise<ServiceComputePrivacy> {
  const { allowAllPublishedAlgorithms } = values
  const publisherTrustedAlgorithms = values.allowAllPublishedAlgorithms
    ? []
    : await createTrustedAlgorithmList(values.publisherTrustedAlgorithms, ocean)

  const privacy: ServiceComputePrivacy = {
    allowNetworkAccess: false,
    allowRawAlgorithm: false,
    allowAllPublishedAlgorithms,
    publisherTrustedAlgorithms
  }

  return privacy
}
