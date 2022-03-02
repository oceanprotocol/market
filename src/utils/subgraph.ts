import { gql, OperationResult, TypedDocumentNode, OperationContext } from 'urql'
import { DDO, Logger } from '@oceanprotocol/lib'
import { getUrqlClientInstance } from '../providers/UrqlProvider'
import { getOceanConfig } from './ocean'
import {
  AssetsPoolPrice,
  AssetsPoolPrice_pools as AssetsPoolPricePool
} from '../@types/apollo/AssetsPoolPrice'
import {
  AssetsFrePrice,
  AssetsFrePrice_fixedRateExchanges as AssetsFrePriceFixedRateExchange
} from '../@types/apollo/AssetsFrePrice'
import {
  AssetsFreePrice,
  AssetsFreePrice_dispensers as AssetFreePriceDispenser
} from '../@types/apollo/AssetsFreePrice'
import { AssetPreviousOrder } from '../@types/apollo/AssetPreviousOrder'
import {
  HighestLiquidityAssets_pools as HighestLiquidityAssetsPool,
  HighestLiquidityAssets as HighestLiquidityGraphAssets
} from '../@types/apollo/HighestLiquidityAssets'
import {
  PoolShares as PoolSharesList,
  PoolShares_poolShares as PoolShare
} from '../@types/apollo/PoolShares'
import { BestPrice } from '../models/BestPrice'
import { OrdersData_tokenOrders as OrdersData } from '../@types/apollo/OrdersData'
import {
  UserSalesQuery_users as UserSales,
  UserSalesQuery as UsersSalesList
} from '../@types/apollo/UserSalesQuery'

export interface UserLiquidity {
  price: string
  oceanBalance: string
}

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
      baseTokenSymbol
      datatoken {
        id
        address
        symbol
      }
    }
  }
`

const AssetFreQuery = gql`
  query AssetFrePrice($datatoken: String) {
    fixedRateExchanges(orderBy: id, where: { datatoken: $datatoken }) {
      rate
      id
      baseTokenSymbol
      datatoken {
        id
        address
        symbol
      }
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
      tokens(where: { isDatatoken: false }) {
        isDatatoken
        symbol
      }
    }
  }
`

const AssetPoolPriceQuery = gql`
  query AssetPoolPrice($datatokenAddress: String) {
    pools(where: { datatokenAddress: $datatokenAddress }) {
      id
      spotPrice
      consumePrice
      datatokenAddress
      datatokenReserve
      oceanReserve
      tokens(where: { isDatatoken: false }) {
        symbol
      }
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
  query HighestLiquidityAssets {
    pools(
      where: { datatokenReserve_gte: 1 }
      orderBy: oceanReserve
      orderDirection: desc
      first: 15
    ) {
      id
      datatokenAddress
      valueLocked
      oceanReserve
    }
  }
`

const UserSharesQuery = gql`
  query UserSharesQuery($user: String, $pools: [String!]) {
    poolShares(where: { userAddress: $user, poolId_in: $pools }) {
      id
      balance
      userAddress {
        id
      }
      poolId {
        id
        datatokenAddress
        valueLocked
        tokens {
          tokenId {
            symbol
          }
        }
        oceanReserve
        datatokenReserve
        totalShares
        consumePrice
        spotPrice
        createTime
      }
    }
  }
`

const userPoolSharesQuery = gql`
  query PoolShares($user: String) {
    poolShares(where: { userAddress: $user, balance_gt: 0.001 }, first: 1000) {
      id
      balance
      userAddress {
        id
      }
      poolId {
        id
        datatokenAddress
        valueLocked
        tokens {
          id
          isDatatoken
          symbol
        }
        oceanReserve
        datatokenReserve
        totalShares
        consumePrice
        spotPrice
        createTime
      }
    }
  }
`

const UserTokenOrders = gql`
  query OrdersData($user: String!) {
    tokenOrders(
      orderBy: timestamp
      orderDirection: desc
      where: { consumer: $user }
    ) {
      datatokenId {
        address
        symbol
      }
      timestamp
      tx
    }
  }
`
const TopSalesQuery = gql`
  query TopSalesQuery {
    users(
      first: 20
      orderBy: nrSales
      orderDirection: desc
      where: { nrSales_not: 0 }
    ) {
      id
      nrSales
    }
  }
`
const UserSalesQuery = gql`
  query UserSalesQuery($userSalesId: ID) {
    users(where: { id: $userSalesId }) {
      id
      nrSales
    }
  }
`

export function getSubgraphUri(chainId: number): string {
  const config = getOceanConfig(chainId)
  return config.subgraphUri
}

export function getQueryContext(chainId: number): OperationContext {
  const queryContext: OperationContext = {
    url: `${getSubgraphUri(
      Number(chainId)
    )}/subgraphs/name/oceanprotocol/ocean-subgraph`,
    requestPolicy: 'cache-and-network'
  }

  return queryContext
}

export async function fetchData(
  query: TypedDocumentNode,
  variables: any,
  context: OperationContext
): Promise<any> {
  try {
    const client = getUrqlClientInstance()
    const response = await client.query(query, variables, context).toPromise()
    return response
  } catch (error) {
    console.error('Error fetchData: ', error.message)
    throw Error(error.message)
  }
}

export async function fetchDataForMultipleChains(
  query: TypedDocumentNode,
  variables: any,
  chainIds: number[]
): Promise<any[]> {
  let datas: any[] = []
  for (const chainId of chainIds) {
    const context: OperationContext = {
      url: `${getSubgraphUri(
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
  frePrice: AssetsFrePriceFixedRateExchange[],
  poolPrice: AssetsPoolPricePool[],
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
      oceanSymbol: poolPrice[0]?.tokens[0]?.symbol,
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
      exchangeId: frePrice[0]?.id,
      oceanSymbol: frePrice[0]?.baseTokenSymbol,
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
      exchangeId: '',
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
      exchangeId: '',
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
    AssetsPoolPricePool[],
    AssetsFrePriceFixedRateExchange[],
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
  let poolPriceResponse: AssetsPoolPricePool[] = []
  let frePriceResponse: AssetsFrePriceFixedRateExchange[] = []
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

    const queryContext = getQueryContext(Number(chainKey))

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
    AssetsPoolPricePool[],
    AssetsFrePriceFixedRateExchange[],
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
  const queryContext = getQueryContext(Number(asset.chainId))

  const poolPriceResponse: OperationResult<AssetsPoolPrice> = await fetchData(
    AssetPoolPriceQuery,
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

export async function getSpotPrice(asset: DDO): Promise<number> {
  const poolVariables = {
    datatokenAddress: asset?.dataToken.toLowerCase()
  }
  const queryContext = getQueryContext(Number(asset.chainId))

  const poolPriceResponse: OperationResult<AssetsPoolPrice> = await fetchData(
    AssetPoolPriceQuery,
    poolVariables,
    queryContext
  )

  return poolPriceResponse.data.pools[0].spotPrice
}

export async function getAssetsBestPrices(
  assets: DDO[]
): Promise<AssetListPrices[]> {
  const assetsWithPrice: AssetListPrices[] = []

  const values: [
    AssetsPoolPricePool[],
    AssetsFrePriceFixedRateExchange[],
    AssetFreePriceDispenser[],
    DidAndDatatokenMap
  ] = await getAssetsPoolsExchangesAndDatatokenMap(assets)

  const poolPriceResponse = values[0]
  const frePriceResponse = values[1]
  const freePriceResponse = values[2]
  for (const ddo of assets) {
    const dataToken = ddo.dataToken.toLowerCase()
    const poolPrice: AssetsPoolPricePool[] = []
    const frePrice: AssetsFrePriceFixedRateExchange[] = []
    const freePrice: AssetFreePriceDispenser[] = []
    const pool = poolPriceResponse.find(
      (pool: AssetsPoolPricePool) => pool.datatokenAddress === dataToken
    )
    pool && poolPrice.push(pool)
    const fre = frePriceResponse.find(
      (fre: AssetsFrePriceFixedRateExchange) =>
        fre.datatoken.address === dataToken
    )
    fre && frePrice.push(fre)
    const free = freePriceResponse.find(
      (free: AssetFreePriceDispenser) => free.datatoken.address === dataToken
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

export async function getHighestLiquidityDatatokens(
  chainIds: number[]
): Promise<string[]> {
  const dtList: string[] = []
  let highestLiquidityAssets: HighestLiquidityAssetsPool[] = []
  for (const chain of chainIds) {
    const queryContext = getQueryContext(Number(chain))
    const fetchedPools: OperationResult<HighestLiquidityGraphAssets, any> =
      await fetchData(HighestLiquidityAssets, null, queryContext)
    highestLiquidityAssets = highestLiquidityAssets.concat(
      fetchedPools.data.pools
    )
  }
  highestLiquidityAssets.sort((a, b) => b.oceanReserve - a.oceanReserve)
  for (let i = 0; i < highestLiquidityAssets.length; i++) {
    if (!highestLiquidityAssets[i].datatokenAddress) continue
    dtList.push(highestLiquidityAssets[i].datatokenAddress)
  }
  return dtList
}

export function calculateUserLiquidity(poolShare: PoolShare): number {
  const ocean =
    (poolShare.balance / poolShare.poolId.totalShares) *
    poolShare.poolId.oceanReserve
  const datatokens =
    (poolShare.balance / poolShare.poolId.totalShares) *
    poolShare.poolId.datatokenReserve
  const totalLiquidity = ocean + datatokens * poolShare.poolId.spotPrice
  return totalLiquidity
}

export async function getAccountLiquidityInOwnAssets(
  accountId: string,
  chainIds: number[],
  pools: string[]
): Promise<UserLiquidity> {
  const queryVariables = {
    user: accountId.toLowerCase(),
    pools: pools
  }
  const results: PoolSharesList[] = await fetchDataForMultipleChains(
    UserSharesQuery,
    queryVariables,
    chainIds
  )
  let totalLiquidity = 0
  let totalOceanLiquidity = 0

  for (const result of results) {
    for (const poolShare of result.poolShares) {
      const userShare = poolShare.balance / poolShare.poolId.totalShares
      const userBalance = userShare * poolShare.poolId.oceanReserve
      totalOceanLiquidity += userBalance
      const poolLiquidity = calculateUserLiquidity(poolShare)
      totalLiquidity += poolLiquidity
    }
  }
  return {
    price: totalLiquidity.toString(),
    oceanBalance: totalOceanLiquidity.toString()
  }
}

export async function getPoolSharesData(
  accountId: string,
  chainIds: number[]
): Promise<PoolShare[]> {
  const variables = { user: accountId?.toLowerCase() }
  const data: PoolShare[] = []
  const result = await fetchDataForMultipleChains(
    userPoolSharesQuery,
    variables,
    chainIds
  )
  for (let i = 0; i < result.length; i++) {
    result[i].poolShares.forEach((poolShare: PoolShare) => {
      data.push(poolShare)
    })
  }
  return data
}

export async function getUserTokenOrders(
  accountId: string,
  chainIds: number[]
): Promise<OrdersData[]> {
  const data: OrdersData[] = []
  const variables = { user: accountId?.toLowerCase() }

  try {
    const tokenOrders = await fetchDataForMultipleChains(
      UserTokenOrders,
      variables,
      chainIds
    )

    for (let i = 0; i < tokenOrders?.length; i++) {
      tokenOrders[i].tokenOrders.forEach((tokenOrder: OrdersData) => {
        data.push(tokenOrder)
      })
    }

    return data
  } catch (error) {
    Logger.error(error.message)
  }
}

export async function getUserSales(
  accountId: string,
  chainIds: number[]
): Promise<number> {
  const variables = { userSalesId: accountId?.toLowerCase() }
  try {
    const userSales = await fetchDataForMultipleChains(
      UserSalesQuery,
      variables,
      chainIds
    )
    let salesSum = 0
    for (let i = 0; i < userSales.length; i++) {
      if (userSales[i].users.length > 0) {
        salesSum += userSales[i].users[0].nrSales
      }
    }
    return salesSum
  } catch (error) {
    Logger.log(error.message)
  }
}

export async function getTopAssetsPublishers(
  chainIds: number[]
): Promise<string[]> {
  const data: string[] = []
  const publisherSales: UserSales[] = []

  for (const chain of chainIds) {
    const queryContext = getQueryContext(Number(chain))
    const fetchedUsers: OperationResult<UsersSalesList> = await fetchData(
      TopSalesQuery,
      null,
      queryContext
    )
    for (let i = 0; i < fetchedUsers.data.users.length; i++) {
      const publishersIndex = publisherSales.findIndex(
        (user) => fetchedUsers.data.users[i].id === user.id
      )
      if (publishersIndex === -1) {
        const publisher: UserSales = {
          id: fetchedUsers.data.users[i].id,
          nrSales: fetchedUsers.data.users[i].nrSales,
          __typename: 'User'
        }
        publisherSales.push(publisher)
      } else {
        const publisher: UserSales = {
          id: fetchedUsers.data.users[i].id,
          nrSales:
            fetchedUsers.data.users[i].nrSales +
            publisherSales[publishersIndex].nrSales,
          __typename: 'User'
        }
        publisherSales[publishersIndex] = publisher
      }
    }
  }

  publisherSales.sort((a, b) => b.nrSales - a.nrSales)
  for (let i = 0; i < publisherSales.length; i++) {
    if (data.length < 9) {
      data.push(publisherSales[i].id)
    } else {
      return data
    }
  }

  return data
}
