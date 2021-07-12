import { gql, OperationResult, TypedDocumentNode, OperationContext } from 'urql'
import { DDO, BestPrice } from '@oceanprotocol/lib'
import { getUrqlClientInstance } from '../providers/UrqlProvider'
import { getOceanConfig } from './ocean'
import web3 from 'web3'
import {
  AssetsPoolPrice,
  AssetsPoolPrice_pools as AssetsPoolPricePools
} from '../@types/apollo/AssetsPoolPrice'
import {
  AssetsFrePrice,
  AssetsFrePrice_fixedRateExchanges as AssetsFrePriceFixedRateExchanges
} from '../@types/apollo/AssetsFrePrice'
import {
  AssetsFreePrice,
  AssetsFreePrice_dispensers as AssetFreePriceDispenser
} from '../@types/apollo/AssetsFreePrice'
import { AssetPreviousOrder } from '../@types/apollo/AssetPreviousOrder'

export interface PriceList {
  [key: string]: string
}

export interface AssetListPrices {
  ddo: DDO
  price: BestPrice
}

interface DidAndDatatokenMap {
  [name: string]: string
}

const FreeQuery = gql`
  query AssetsFreePrice($datatoken_in: [String!]) {
    dispensers(orderBy: id, where: { datatoken_in: $datatoken_in }) {
      datatoken {
        id
        address
      }
    }
  }
`

const AssetFreeQuery = gql`
  query AssetFreePrice($datatoken: String) {
    dispensers(orderBy: id, where: { datatoken: $datatoken }) {
      active
      owner {
        id
      }
      minterApproved
      isTrueMinter
      maxTokens
      maxBalance
      balance
      datatoken {
        id
      }
    }
  }
`

const FreQuery = gql`
  query AssetsFrePrice($datatoken_in: [String!]) {
    fixedRateExchanges(orderBy: id, where: { datatoken_in: $datatoken_in }) {
      rate
      id
      datatoken {
        id
        address
      }
    }
  }
`

const AssetFreQuery = gql`
  query AssetFrePrice($datatoken: String) {
    fixedRateExchanges(orderBy: id, where: { datatoken: $datatoken }) {
      rate
      id
    }
  }
`

const PoolQuery = gql`
  query AssetsPoolPrice($datatokenAddress_in: [String!]) {
    pools(where: { datatokenAddress_in: $datatokenAddress_in }) {
      id
      spotPrice
      consumePrice
      datatokenAddress
      datatokenReserve
      oceanReserve
    }
  }
`

const AssetPoolPriceQuerry = gql`
  query AssetPoolPrice($datatokenAddress: String) {
    pools(where: { datatokenAddress: $datatokenAddress }) {
      id
      spotPrice
      consumePrice
      datatokenAddress
      datatokenReserve
      oceanReserve
    }
  }
`

const PreviousOrderQuery = gql`
  query AssetPreviousOrder($id: String!, $account: String!) {
    tokenOrders(
      first: 1
      where: { datatokenId: $id, payer: $account }
      orderBy: timestamp
      orderDirection: desc
    ) {
      timestamp
      tx
    }
  }
`
const HighestLiquidityAssets = gql`
  query HighestLiquidiyAssets {
    pools(
      where: { datatokenReserve_gte: 1 }
      orderBy: valueLocked
      orderDirection: desc
      first: 15
    ) {
      id
      datatokenAddress
      valueLocked
    }
  }
`

export function getSubgrahUri(chainId: number): string {
  const config = getOceanConfig(chainId)
  return config.subgraphUri
}

async function fetchData(
  query: TypedDocumentNode,
  variables: any,
  context: OperationContext
): Promise<OperationResult> {
  try {
    const client = getUrqlClientInstance()
    const response = await client.query(query, variables, context).toPromise()
    return response
  } catch (error) {
    console.error('Error fetchData: ', error.message)
  }
}

export async function fetchDataForMultipleChains(
  query: TypedDocumentNode,
  variables: any,
  chainIds: number[]
): Promise<any[]> {
  let datas: any[] = []
  for (const chainId of chainIds) {
    console.log(chainId)
    const context: OperationContext = {
      url: `${getSubgrahUri(
        chainId
      )}/subgraphs/name/oceanprotocol/ocean-subgraph`,
      requestPolicy: 'network-only'
    }
    try {
      const response = await fetchData(query, variables, context)
      datas = datas.concat(response.data)
    } catch (error) {
      console.error('Error fetchData: ', error.message)
    }
  }
  return datas
}

export async function getPreviousOrders(
  id: string,
  account: string,
  assetTimeout: string
): Promise<string> {
  const variables = {
    id: id,
    account: account
  }
  const fetchedPreviousOrders: OperationResult<AssetPreviousOrder> =
    await fetchData(PreviousOrderQuery, variables, null)
  if (fetchedPreviousOrders.data?.tokenOrders?.length === 0) return null
  if (assetTimeout === '0') {
    return fetchedPreviousOrders?.data?.tokenOrders[0]?.tx
  } else {
    const expiry =
      fetchedPreviousOrders?.data?.tokenOrders[0]?.timestamp * 1000 +
      Number(assetTimeout) * 1000
    if (Date.now() <= expiry) {
      return fetchedPreviousOrders?.data?.tokenOrders[0]?.tx
    } else {
      return null
    }
  }
}

function transformPriceToBestPrice(
  frePrice: AssetsFrePriceFixedRateExchanges[],
  poolPrice: AssetsPoolPricePools[],
  freePrice: AssetFreePriceDispenser[]
) {
  if (poolPrice?.length > 0) {
    const price: BestPrice = {
      type: 'pool',
      address: poolPrice[0]?.id,
      value:
        poolPrice[0]?.consumePrice === '-1'
          ? poolPrice[0]?.spotPrice
          : poolPrice[0]?.consumePrice,
      ocean: poolPrice[0]?.oceanReserve,
      datatoken: poolPrice[0]?.datatokenReserve,
      pools: [poolPrice[0]?.id],
      isConsumable: poolPrice[0]?.consumePrice === '-1' ? 'false' : 'true'
    }
    return price
  } else if (frePrice?.length > 0) {
    // TODO Hacky hack, temporary™: set isConsumable to true for fre assets.
    // isConsumable: 'true'
    const price: BestPrice = {
      type: 'exchange',
      value: frePrice[0]?.rate,
      address: frePrice[0]?.id,
      exchange_id: frePrice[0]?.id,
      ocean: 0,
      datatoken: 0,
      pools: [],
      isConsumable: 'true'
    }
    return price
  } else if (freePrice?.length > 0) {
    const price: BestPrice = {
      type: 'free',
      value: 0,
      address: freePrice[0]?.datatoken.id,
      exchange_id: '',
      ocean: 0,
      datatoken: 0,
      pools: [],
      isConsumable: 'true'
    }
    return price
  } else {
    const price: BestPrice = {
      type: '',
      value: 0,
      address: '',
      exchange_id: '',
      ocean: 0,
      datatoken: 0,
      pools: [],
      isConsumable: 'false'
    }
    return price
  }
}

async function getAssetsPoolsExchangesAndDatatokenMap(
  assets: DDO[]
): Promise<
  [
    AssetsPoolPricePools[],
    AssetsFrePriceFixedRateExchanges[],
    AssetFreePriceDispenser[],
    DidAndDatatokenMap
  ]
> {
  const didDTMap: DidAndDatatokenMap = {}
  const chainAssetLists: any = {}

  for (const ddo of assets) {
    didDTMap[ddo?.dataToken.toLowerCase()] = ddo.id
    //  harcoded until we have chainId on assets
    if (chainAssetLists[ddo.chainId]) {
      chainAssetLists[ddo.chainId].push(ddo?.dataToken.toLowerCase())
    } else {
      chainAssetLists[ddo.chainId] = []
      chainAssetLists[ddo.chainId].push(ddo?.dataToken.toLowerCase())
    }
  }
  let poolPriceResponse: AssetsPoolPricePools[] = []
  let frePriceResponse: AssetsFrePriceFixedRateExchanges[] = []
  let freePriceResponse: AssetFreePriceDispenser[] = []

  for (const chainKey in chainAssetLists) {
    const freVariables = {
      datatoken_in: chainAssetLists[chainKey]
    }
    const poolVariables = {
      datatokenAddress_in: chainAssetLists[chainKey]
    }
    const freeVariables = {
      datatoken_in: chainAssetLists[chainKey]
    }

    const queryContext: OperationContext = {
      url: `${getSubgrahUri(
        Number(chainKey)
      )}/subgraphs/name/oceanprotocol/ocean-subgraph`,
      requestPolicy: 'network-only'
    }

    const chainPoolPriceResponse: OperationResult<AssetsPoolPrice> =
      await fetchData(PoolQuery, poolVariables, queryContext)

    poolPriceResponse = poolPriceResponse.concat(
      chainPoolPriceResponse.data.pools
    )
    const chainFrePriceResponse: OperationResult<AssetsFrePrice> =
      await fetchData(FreQuery, freVariables, queryContext)

    frePriceResponse = frePriceResponse.concat(
      chainFrePriceResponse.data.fixedRateExchanges
    )

    const chainFreePriceResponse: OperationResult<AssetsFreePrice> =
      await fetchData(FreeQuery, freeVariables, queryContext)

    freePriceResponse = freePriceResponse.concat(
      chainFreePriceResponse.data.dispensers
    )
  }
  return [poolPriceResponse, frePriceResponse, freePriceResponse, didDTMap]
}

export async function getAssetsPriceList(assets: DDO[]): Promise<PriceList> {
  const priceList: PriceList = {}

  const values: [
    AssetsPoolPricePools[],
    AssetsFrePriceFixedRateExchanges[],
    AssetFreePriceDispenser[],
    DidAndDatatokenMap
  ] = await getAssetsPoolsExchangesAndDatatokenMap(assets)
  const poolPriceResponse = values[0]
  const frePriceResponse = values[1]
  const freePriceResponse = values[2]
  const didDTMap: DidAndDatatokenMap = values[3]

  for (const poolPrice of poolPriceResponse) {
    priceList[didDTMap[poolPrice.datatokenAddress]] =
      poolPrice.consumePrice === '-1'
        ? poolPrice.spotPrice
        : poolPrice.consumePrice
  }
  for (const frePrice of frePriceResponse) {
    priceList[didDTMap[frePrice.datatoken?.address]] = frePrice.rate
  }
  for (const freePrice of freePriceResponse) {
    priceList[didDTMap[freePrice.datatoken?.address]] = '0'
  }
  return priceList
}

export async function getPrice(asset: DDO): Promise<BestPrice> {
  const freVariables = {
    datatoken: asset?.dataToken.toLowerCase()
  }
  const freeVariables = {
    datatoken: asset?.dataToken.toLowerCase()
  }
  const poolVariables = {
    datatokenAddress: asset?.dataToken.toLowerCase()
  }

  const queryContext: OperationContext = {
    url: `${getSubgrahUri(
      asset.chainId
    )}/subgraphs/name/oceanprotocol/ocean-subgraph`,
    requestPolicy: 'network-only'
  }
  const poolPriceResponse: OperationResult<AssetsPoolPrice> = await fetchData(
    AssetPoolPriceQuerry,
    poolVariables,
    queryContext
  )
  const frePriceResponse: OperationResult<AssetsFrePrice> = await fetchData(
    AssetFreQuery,
    freVariables,
    queryContext
  )
  const freePriceResponse: OperationResult<AssetsFreePrice> = await fetchData(
    AssetFreeQuery,
    freeVariables,
    queryContext
  )

  const bestPrice: BestPrice = transformPriceToBestPrice(
    frePriceResponse.data.fixedRateExchanges,
    poolPriceResponse.data.pools,
    freePriceResponse.data.dispensers
  )

  return bestPrice
}

export async function getAssetsBestPrices(
  assets: DDO[]
): Promise<AssetListPrices[]> {
  const assetsWithPrice: AssetListPrices[] = []

  const values: [
    AssetsPoolPricePools[],
    AssetsFrePriceFixedRateExchanges[],
    AssetFreePriceDispenser[],
    DidAndDatatokenMap
  ] = await getAssetsPoolsExchangesAndDatatokenMap(assets)

  const poolPriceResponse = values[0]
  const frePriceResponse = values[1]
  const freePriceResponse = values[2]
  for (const ddo of assets) {
    const dataToken = ddo.dataToken.toLowerCase()
    const poolPrice: AssetsPoolPricePools[] = []
    const frePrice: AssetsFrePriceFixedRateExchanges[] = []
    const freePrice: AssetFreePriceDispenser[] = []
    const pool = poolPriceResponse.find(
      (pool: any) => pool.datatokenAddress === dataToken
    )
    pool && poolPrice.push(pool)
    const fre = frePriceResponse.find(
      (fre: any) => fre.datatoken.address === dataToken
    )
    fre && frePrice.push(fre)
    const free = freePriceResponse.find(
      (free: any) => free.datatoken.address === dataToken
    )
    free && freePrice.push(free)
    const bestPrice = transformPriceToBestPrice(frePrice, poolPrice, freePrice)
    assetsWithPrice.push({
      ddo: ddo,
      price: bestPrice
    })
  }

  return assetsWithPrice
}

export async function getHighestLiquidityDIDs(
  chainIds: number[]
): Promise<string> {
  const didList: string[] = []
  for (const chain of chainIds) {
    const queryContext: OperationContext = {
      url: `${getSubgrahUri(
        Number(chain)
      )}/subgraphs/name/oceanprotocol/ocean-subgraph`,
      requestPolicy: 'network-only'
    }
    const fetchedPools = await fetchData(
      HighestLiquidityAssets,
      null,
      queryContext
    )
    if (fetchedPools.data?.pools?.length === 0) return null
    for (let i = 0; i < fetchedPools.data.pools.length; i++) {
      if (!fetchedPools.data.pools[i].datatokenAddress) continue
      const did = web3.utils
        .toChecksumAddress(fetchedPools.data.pools[i].datatokenAddress)
        .replace('0x', 'did:op:')
      didList.push(did)
    }
  }
  const searchDids = JSON.stringify(didList)
    .replace(/,/g, ' ')
    .replace(/"/g, '')
    .replace(/(\[|\])/g, '')
    .replace(/(did:op:)/g, '0x')
  return searchDids
}
