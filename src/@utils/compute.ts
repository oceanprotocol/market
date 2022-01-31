// import {
//   ServiceComputePrivacy,
//   publisherTrustedAlgorithm as PublisherTrustedAlgorithm,
//   Service,
//   LoggerInstance,
//   Provider,
//   Config,
//   Ocean,
//   Account
// } from '@oceanprotocol/lib'
// import { ComputeJob } from '@oceanprotocol/lib/dist/node/ocean/interfaces/Compute'
import { Asset } from '@oceanprotocol/lib'
import { CancelToken } from 'axios'
import { gql } from 'urql'
import { queryMetadata, getFilterTerm, generateBaseQuery } from './aquarius'
import { fetchDataForMultipleChains } from './subgraph'

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

// export async function createTrustedAlgorithmList(
//   selectedAlgorithms: string[], // list of DIDs
//   ocean: Ocean
// ): Promise<PublisherTrustedAlgorithm[]> {
//   const trustedAlgorithms = []

//   for (const selectedAlgorithm of selectedAlgorithms) {
//     const trustedAlgorithm =
//       await ocean.compute.createPublisherTrustedAlgorithmfromDID(
//         selectedAlgorithm
//       )
//     trustedAlgorithms.push(trustedAlgorithm)
//   }
//   return trustedAlgorithms
// }

// export async function transformComputeFormToServiceComputePrivacy(
//   values: ComputePrivacyForm,
//   ocean: Ocean
// ): Promise<ServiceComputePrivacy> {
//   const { allowAllPublishedAlgorithms } = values
//   const publisherTrustedAlgorithms = values.allowAllPublishedAlgorithms
//     ? []
//     : await createTrustedAlgorithmList(values.publisherTrustedAlgorithms, ocean)

//   const privacy: ServiceComputePrivacy = {
//     allowNetworkAccess: false,
//     allowRawAlgorithm: false,
//     allowAllPublishedAlgorithms,
//     publisherTrustedAlgorithms
//   }

//   return privacy
// }
