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
  ComputeEnvironment,
  ComputeJob
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
import { SortTermOptions } from 'src/@types/aquarius/SearchQuery'
import { AssetSelectionAsset } from '@shared/FormFields/AssetSelection'
import { transformAssetToAssetSelection } from './assetConvertor'
import { AssetExtended } from 'src/@types/AssetExtended'
import { ComputeEditForm } from 'src/components/Asset/Edit/_types'
import { getFileDidInfo } from './provider'

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
      getFilterTerm('services.datatokenAddress', queryDtList),
      getFilterTerm('services.type', 'compute'),
      getFilterTerm('metadata.type', 'dataset')
    ],
    ignorePurgatory: true
  } as BaseQueryParams
  const query = generateBaseQuery(baseQueryparams)
  const result = await queryMetadata(query, cancelToken)
  return result?.results
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

export function getValidUntilTime(
  computeEnvMaxJobDuration: number,
  datasetTimeout?: number,
  algorithmTimeout?: number
) {
  const inputValues = []
  computeEnvMaxJobDuration && inputValues.push(computeEnvMaxJobDuration)
  datasetTimeout && inputValues.push(datasetTimeout)
  algorithmTimeout && inputValues.push(algorithmTimeout)

  const minValue = Math.min(...inputValues)
  const mytime = new Date()
  mytime.setMinutes(mytime.getMinutes() + Math.floor(minValue / 60))
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

export function getQueryString(
  trustedAlgorithmList: PublisherTrustedAlgorithm[],
  trustedPublishersList: string[],
  chainId?: number
): SearchQuery {
  const algorithmDidList = trustedAlgorithmList?.map((x) => x.did)

  const baseParams = {
    chainIds: [chainId],
    sort: { sortBy: SortTermOptions.Created },
    filters: [getFilterTerm('metadata.type', 'algorithm')]
  } as BaseQueryParams
  algorithmDidList?.length > 0 &&
    baseParams.filters.push(getFilterTerm('_id', algorithmDidList))
  trustedPublishersList?.length > 0 &&
    baseParams.filters.push(getFilterTerm('nft.owner', trustedPublishersList))
  const query = generateBaseQuery(baseParams)

  return query
}

export async function getAlgorithmsForAsset(
  asset: Asset,
  token: CancelToken
): Promise<Asset[]> {
  const computeService: Service = getServiceByName(asset, 'compute')

  if (
    !computeService.compute ||
    (computeService.compute.publisherTrustedAlgorithms?.length === 0 &&
      computeService.compute.publisherTrustedAlgorithmPublishers?.length === 0)
  ) {
    return []
  }

  const gueryResults = await queryMetadata(
    getQueryString(
      computeService.compute.publisherTrustedAlgorithms,
      computeService.compute.publisherTrustedAlgorithmPublishers,
      asset.chainId
    ),
    token
  )

  const algorithms: Asset[] = gueryResults?.results
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

async function getJobs(
  providerUrls: string[],
  accountId: string,
  assets: Asset[]
): Promise<ComputeJobMetaData[]> {
  const computeJobs: ComputeJobMetaData[] = []
  // commented loop since we decide how to filter jobs
  // for await (const providerUrl of providerUrls) {
  try {
    const providerComputeJobs = (await ProviderInstance.computeStatus(
      providerUrls[0],
      accountId
    )) as ComputeJob[]

    if (providerComputeJobs) {
      providerComputeJobs.sort((a, b) => {
        if (a.dateCreated > b.dateCreated) {
          return -1
        }
        if (a.dateCreated < b.dateCreated) {
          return 1
        }
        return 0
      })

      providerComputeJobs.forEach((job) => {
        const did = job.inputDID[0]
        const asset = assets.filter((x) => x.id === did)[0]
        if (asset) {
          const compJob: ComputeJobMetaData = {
            ...job,
            assetName: asset.metadata.name,
            assetDtSymbol: asset.datatokens[0].symbol,
            networkId: asset.chainId
          }
          computeJobs.push(compJob)
        }
      })
    }
  } catch (err) {
    LoggerInstance.error(err.message)
  }
  // }
  return computeJobs
}

export async function getComputeJobs(
  chainIds: number[],
  accountId: string,
  asset?: AssetExtended,
  cancelToken?: CancelToken
): Promise<ComputeResults> {
  if (!accountId) return
  const assetDTAddress = asset?.datatokens[0]?.address
  const computeResult: ComputeResults = {
    computeJobs: [],
    isLoaded: false
  }
  const variables = assetDTAddress
    ? {
        user: accountId.toLowerCase(),
        datatokenAddress: assetDTAddress.toLowerCase()
      }
    : {
        user: accountId.toLowerCase()
      }

  const results = await fetchDataForMultipleChains(
    assetDTAddress ? getComputeOrdersByDatatokenAddress : getComputeOrders,
    variables,
    assetDTAddress ? [asset?.chainId] : chainIds
  )

  let tokenOrders: TokenOrder[] = []
  results.map((result) =>
    result.orders.forEach((tokenOrder: TokenOrder) =>
      tokenOrders.push(tokenOrder)
    )
  )
  if (tokenOrders.length === 0) {
    computeResult.isLoaded = true
    return computeResult
  }

  tokenOrders = tokenOrders.sort(
    (a, b) => b.createdTimestamp - a.createdTimestamp
  )

  const datatokenAddressList = tokenOrders.map(
    (tokenOrder: TokenOrder) => tokenOrder.datatoken.address
  )
  if (!datatokenAddressList) return

  const assets = await getAssetMetadata(
    datatokenAddressList,
    cancelToken,
    chainIds
  )

  const providerUrls: string[] = []
  assets.forEach((asset: Asset) =>
    providerUrls.push(asset.services[0].serviceEndpoint)
  )

  computeResult.computeJobs = await getJobs(providerUrls, accountId, assets)
  computeResult.isLoaded = true

  return computeResult
}

export async function createTrustedAlgorithmList(
  selectedAlgorithms: string[], // list of DIDs,
  assetChainId: number,
  cancelToken: CancelToken
): Promise<PublisherTrustedAlgorithm[]> {
  const trustedAlgorithms: PublisherTrustedAlgorithm[] = []

  // Condition to prevent app from hitting Aquarius with empty DID list
  // when nothing is selected in the UI.
  if (!selectedAlgorithms || selectedAlgorithms.length === 0)
    return trustedAlgorithms

  const selectedAssets = await retrieveDDOListByDIDs(
    selectedAlgorithms,
    [assetChainId],
    cancelToken
  )

  if (!selectedAssets || selectedAssets.length === 0) return []

  for (const selectedAlgorithm of selectedAssets) {
    const filesChecksum = await getFileDidInfo(
      selectedAlgorithm?.id,
      selectedAlgorithm?.services?.[0].id,
      selectedAlgorithm?.services?.[0]?.serviceEndpoint,
      true
    )
    const containerChecksum =
      selectedAlgorithm.metadata.algorithm.container.entrypoint +
      selectedAlgorithm.metadata.algorithm.container.checksum
    const trustedAlgorithm = {
      did: selectedAlgorithm.id,
      containerSectionChecksum: getHash(containerChecksum),
      filesChecksum: filesChecksum?.[0]?.checksum
    }
    trustedAlgorithms.push(trustedAlgorithm)
  }
  return trustedAlgorithms
}

export async function transformComputeFormToServiceComputeOptions(
  values: ComputeEditForm,
  currentOptions: ServiceComputeOptions,
  assetChainId: number,
  cancelToken: CancelToken
): Promise<ServiceComputeOptions> {
  const publisherTrustedAlgorithms = values.allowAllPublishedAlgorithms
    ? null
    : await createTrustedAlgorithmList(
        values.publisherTrustedAlgorithms,
        assetChainId,
        cancelToken
      )

  // TODO: add support for selecting trusted publishers and transforming here.
  // This only deals with basics so we don't accidentially allow all accounts
  // to be trusted.
  const publisherTrustedAlgorithmPublishers: string[] = []

  const privacy: ServiceComputeOptions = {
    ...currentOptions,
    publisherTrustedAlgorithms,
    publisherTrustedAlgorithmPublishers
  }

  return privacy
}

export async function checkComputeResourcesValidity(
  asset: Asset,
  accountId: string,
  computeEnvMaxJobDuration: number,
  datasetTimeout?: number,
  algorithmTimeout?: number,
  cancelToken?: CancelToken
): Promise<boolean> {
  const jobs = await getComputeJobs(
    [asset?.chainId],
    accountId,
    asset,
    cancelToken
  )
  if (jobs.computeJobs.length <= 0) return false
  const inputValues = []
  computeEnvMaxJobDuration && inputValues.push(computeEnvMaxJobDuration * 60)
  datasetTimeout && inputValues.push(datasetTimeout)
  algorithmTimeout && inputValues.push(algorithmTimeout)
  const minValue = Math.min(...inputValues)
  const jobStartDate = new Date(
    parseInt(jobs.computeJobs[0].dateCreated) * 1000
  )
  jobStartDate.setMinutes(jobStartDate.getMinutes() + Math.floor(minValue / 60))
  const currentTime = new Date().getTime() / 1000
  return Math.floor(jobStartDate.getTime() / 1000) > currentTime
}
