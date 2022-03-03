import {
  Asset,
  ServiceComputeOptions,
  PublisherTrustedAlgorithm,
  getHash,
  LoggerInstance,
  ComputeAlgorithm,
  DDO,
  Service,
  ProviderInstance,
  ComputeEnvironment
} from '@oceanprotocol/lib'
import { CancelToken } from 'axios'
import { gql } from 'urql'
import {
  queryMetadata,
  getFilterTerm,
  generateBaseQuery,
  retrieveDDOListByDIDs
} from './aquarius'
import { fetchDataForMultipleChains } from './subgraph'
import { getServiceById, getServiceByName } from './ddo'
import { getOceanConfig } from './ocean'
import { SortTermOptions } from 'src/@types/aquarius/SearchQuery'
import { AssetSelectionAsset } from '@shared/FormFields/AssetSelection'
import { transformAssetToAssetSelection } from './assetConvertor'

const getComputeOrders = gql`
  query ComputeOrders($user: String!) {
    orders(
      orderBy: createdTimestamp
      orderDirection: desc
      where: { payer: $user }
    ) {
      id
      serviceIndex
      datatoken {
        address
      }
      tx
      createdTimestamp
    }
  }
`

const getComputeOrdersByDatatokenAddress = gql`
  query ComputeOrdersByDatatokenAddress(
    $user: String!
    $datatokenAddress: String!
  ) {
    orders(
      orderBy: createdTimestamp
      orderDirection: desc
      where: { payer: $user, datatoken: $datatokenAddress }
    ) {
      id
      serviceIndex
      datatoken {
        address
      }
      tx
      createdTimestamp
    }
  }
`

async function getAssetMetadata(
  queryDtList: string[],
  cancelToken: CancelToken,
  chainIds: number[]
): Promise<Asset[]> {
  const baseQueryparams = {
    chainIds,
    filters: [
      getFilterTerm('dataToken', queryDtList),
      getFilterTerm('service.type', 'compute'),
      getFilterTerm('service.attributes.main.type', 'dataset')
    ],
    ignorePurgatory: true
  } as BaseQueryParams
  const query = generateBaseQuery(baseQueryparams)
  const result = await queryMetadata(query, cancelToken)

  return result.results
}

export async function isOrderable(
  asset: Asset | DDO,
  serviceId: string,
  algorithm: ComputeAlgorithm,
  algorithmDDO: Asset | DDO
): Promise<boolean> {
  const datasetService: Service = getServiceById(asset, serviceId)
  if (!datasetService) return false
  if (datasetService.type === 'compute') {
    if (algorithm.meta) {
      // check if raw algo is allowed
      if (datasetService.compute.allowRawAlgorithm) return true
      LoggerInstance.error('ERROR: This service does not allow raw algorithm')
      return false
    }
    if (algorithm.documentId) {
      const algoService: Service = getServiceById(
        algorithmDDO,
        algorithm.serviceId
      )
      if (algoService && algoService.type === 'compute') {
        if (algoService.serviceEndpoint !== datasetService.serviceEndpoint) {
          this.logger.error(
            'ERROR: Both assets with compute service are not served by the same provider'
          )
          return false
        }
      }
    }
  }
  return true
}

export function getValidUntilTime() {
  const mytime = new Date()
  mytime.setMinutes(mytime.getMinutes() + 19)
  return Math.floor(mytime.getTime() / 1000)
}

export async function getComputeEnviroment(
  asset: Asset
): Promise<ComputeEnvironment> {
  if (asset?.services[0]?.type !== 'compute') return null
  try {
    const computeEnvs = await ProviderInstance.getComputeEnvironments(
      asset.services[0].serviceEndpoint
    )
    if (!computeEnvs[0]) return null
    return computeEnvs[0]
  } catch (e) {
    LoggerInstance.error('[compute] Fetch compute enviroment: ', e.message)
  }
}

export function getQuerryString(
  trustedAlgorithmList: PublisherTrustedAlgorithm[],
  chainId?: number
): SearchQuery {
  const algorithmDidList = trustedAlgorithmList.map((x) => x.did)

  const baseParams = {
    chainIds: [chainId],
    sort: { sortBy: SortTermOptions.Created },
    filters: [
      getFilterTerm('metadata.type', 'algorithm'),
      algorithmDidList.length > 0 && getFilterTerm('_id', algorithmDidList)
    ]
  } as BaseQueryParams

  const query = generateBaseQuery(baseParams)
  console.log('query', query)

  return query
}

export async function getAlgorithmsForAsset(
  asset: Asset,
  token: CancelToken
): Promise<Asset[]> {
  const computeService: Service = getServiceByName(asset, 'compute')
  const publisherTrustedAlgorithms =
    computeService.compute.publisherTrustedAlgorithms || []
  console.log('asset', asset)
  console.log('computeService', computeService)

  let algorithms: Asset[]
  if (
    !computeService.compute
    // !computeService.compute.publisherTrustedAlgorithms ||
    // computeService.compute.publisherTrustedAlgorithms.length === 0
  ) {
    algorithms = []
  } else {
    console.log(
      'computeService.compute.publisherTrustedAlgorithms',
      publisherTrustedAlgorithms
    )
    const gueryResults = await queryMetadata(
      getQuerryString(publisherTrustedAlgorithms, asset.chainId),
      token
    )
    algorithms = gueryResults?.results
    console.log('algorithms', algorithms)
  }
  return algorithms
}

export async function getAlgorithmAssetSelectionList(
  asset: Asset,
  algorithms: Asset[]
): Promise<AssetSelectionAsset[]> {
  const computeService: Service = getServiceByName(asset, 'compute')
  let algorithmSelectionList: AssetSelectionAsset[]
  if (!computeService.compute) {
    algorithmSelectionList = []
  } else {
    algorithmSelectionList = await transformAssetToAssetSelection(
      computeService?.serviceEndpoint,
      algorithms,
      []
    )
  }
  return algorithmSelectionList
}

function getServiceEndpoints(data: TokenOrder[], assets: Asset[]): string[] {
  // const serviceEndpoints: string[] = []

  // for (let i = 0; i < data.length; i++) {
  //   try {
  //     const did = web3.utils
  //       .toChecksumAddress(data[i].datatokenId.address)
  //       .replace('0x', 'did:op:')
  //     const ddo = assets.filter((x) => x.id === did)[0]
  //     if (ddo === undefined) continue

  //     const service = ddo.services.filter(
  //       (x: Service) => x.index === data[i].serviceId
  //     )[0]

  //     if (!service || service.type !== 'compute') continue
  //     const { providerEndpoint } = service

  //     const wasProviderQueried =
  //       serviceEndpoints?.filter((x) => x === providerEndpoint).length > 0

  //     if (wasProviderQueried) continue
  //     serviceEndpoints.push(providerEndpoint)
  //   } catch (err) {
  //     LoggerInstance.error(err.message)
  //   }
  // }

  // return serviceEndpoints

  return ['dummy']
}

// async function getProviders(
//   serviceEndpoints: string[],
//   config: Config,
//   ocean: Ocean
// ): Promise<Provider[]> {
//   const providers: Provider[] = []

//   try {
//     for (let i = 0; i < serviceEndpoints?.length; i++) {
//       const instanceConfig = {
//         config,
//         web3: config.web3Provider,
//         logger: LoggerInstance,
//         ocean
//       }
//       const provider = await Provider.getInstance(instanceConfig)
//       await provider.setBaseUrl(serviceEndpoints[i])
//       const hasSameCompute =
//         providers.filter((x) => x.computeAddress === provider.computeAddress)
//           .length > 0
//       if (!hasSameCompute) providers.push(provider)
//     }
//   } catch (err) {
//     LoggerInstance.error(err.message)
//   }

//   return providers
// }

// async function getJobs(
//   providers: Provider[],
//   account: Account,
//   assets: Asset[]
// ): Promise<ComputeJobMetaData[]> {
//   const computeJobs: ComputeJobMetaData[] = []

//   for (let i = 0; i < providers.length; i++) {
//     try {
//       const providerComputeJobs = (await providers[i].computeStatus(
//         '',
//         account,
//         undefined,
//         undefined,
//         false
//       )) as ComputeJob[]

//       // means the provider uri is not good, so we ignore it and move on
//       if (!providerComputeJobs) continue
//       providerComputeJobs.sort((a, b) => {
//         if (a.dateCreated > b.dateCreated) {
//           return -1
//         }
//         if (a.dateCreated < b.dateCreated) {
//           return 1
//         }
//         return 0
//       })

//       for (let j = 0; j < providerComputeJobs?.length; j++) {
//         const job = providerComputeJobs[j]
//         const did = job.inputDID[0]
//         const ddo = assets.filter((x) => x.id === did)[0]

//         if (!ddo) continue

//         const compJob: ComputeJobMetaData = {
//           ...job,
//           assetName: ddo.metadata.name,
//           assetDtSymbol: ddo.dataTokenInfo.symbol,
//           networkId: ddo.chainId
//         }
//         computeJobs.push(compJob)
//       }
//     } catch (err) {
//       LoggerInstance.error(err.message)
//     }
//   }

//   return computeJobs
// }

// function getDtList(data: TokenOrder[]): string[] {
//   const dtList = []

//   for (let i = 0; i < data.length; i++) {
//     dtList.push(data[i].datatokenId.address)
//   }

//   return dtList
// }

// export async function getComputeJobs(
//   chainIds: number[],
//   account: Account,
//   ddo?: Asset,
//   token?: CancelToken
// ): Promise<ComputeResults> {
//   const assetDTAddress = ddo?.dataTokenInfo?.address
//   let computeResult: ComputeResults = {
//     computeJobs: [],
//     isLoaded: false
//   }
//   let isLoading = true
//   const variables = assetDTAddress
//     ? {
//         user: account?.getId().toLowerCase(),
//         datatokenAddress: assetDTAddress.toLowerCase()
//       }
//     : {
//         user: account?.getId().toLowerCase()
//       }

//   const result = await fetchDataForMultipleChains(
//     assetDTAddress ? getComputeOrdersByDatatokenAddress : getComputeOrders,
//     variables,
//     assetDTAddress ? [ddo?.chainId] : chainIds
//   )
//   let data: TokenOrder[] = []
//   for (let i = 0; i < result.length; i++) {
//     if (!result[i]?.tokenOrders || result[i].tokenOrders.length === 0) continue
//     result[i]?.tokenOrders.forEach((tokenOrder: TokenOrder) => {
//       data.push(tokenOrder)
//     })
//   }
//   if (!ocean || !account || !data) return

//   if (data.length === 0) {
//     return computeResult
//   }

//   data = data.sort((a, b) => b.timestamp - a.timestamp)
//   const queryDtList = getDtList(data)
//   if (!queryDtList) return

//   const assets = await getAssetMetadata(queryDtList, token, chainIds)
//   const serviceEndpoints = getServiceEndpoints(data, assets)
//   const providers: Provider[] = await getProviders(
//     serviceEndpoints,
//     config,
//     ocean
//   )
//   const computeJobs = await getJobs(providers, account, assets)
//   isLoading = false
//   computeResult = {
//     computeJobs: computeJobs,
//     isLoaded: isLoading
//   }

//   return computeResult
// }

export async function createTrustedAlgorithmList(
  selectedAlgorithms: string[], // list of DIDs,
  assetChainId: number,
  cancelToken: CancelToken
): Promise<PublisherTrustedAlgorithm[]> {
  const trustedAlgorithms: PublisherTrustedAlgorithm[] = []

  const selectedAssets = await retrieveDDOListByDIDs(
    selectedAlgorithms,
    [assetChainId],
    cancelToken
  )

  for (const selectedAlgorithm of selectedAssets) {
    const trustedAlgorithm = {
      did: selectedAlgorithm.id,
      containerSectionChecksum: getHash(
        JSON.stringify(selectedAlgorithm.metadata.algorithm.container)
      ),
      filesChecksum: getHash(selectedAlgorithm.services[0].files)
    }
    trustedAlgorithms.push(trustedAlgorithm)
  }
  return trustedAlgorithms
}

export async function transformComputeFormToServiceComputeOptions(
  values: ComputePrivacyForm,
  currentOptions: ServiceComputeOptions,
  assetChainId: number,
  cancelToken: CancelToken
): Promise<ServiceComputeOptions> {
  const publisherTrustedAlgorithms = values.allowAllPublishedAlgorithms
    ? []
    : await createTrustedAlgorithmList(
        values.publisherTrustedAlgorithms,
        assetChainId,
        cancelToken
      )

  const privacy: ServiceComputeOptions = {
    ...currentOptions,
    publisherTrustedAlgorithms
  }

  return privacy
}
