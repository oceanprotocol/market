import { gql, OperationResult, TypedDocumentNode, OperationContext } from 'urql'
import { Asset, LoggerInstance } from '@oceanprotocol/lib'
import { getUrqlClientInstance } from '@context/UrqlProvider'
import { getOceanConfig } from './ocean'
import { AssetPoolPrice } from '../@types/subgraph/AssetPoolPrice'
import { AssetPreviousOrder } from '../@types/subgraph/AssetPreviousOrder'
import {
  HighestLiquidityAssets_pools as HighestLiquidityAssetsPool,
  HighestLiquidityAssets as HighestLiquidityGraphAssets
} from '../@types/subgraph/HighestLiquidityAssets'
import {
  PoolShares as PoolSharesList,
  PoolShares_poolShares as PoolShare
} from '../@types/subgraph/PoolShares'
import {
  OrdersData_orders as OrdersData,
  OrdersData_orders_datatoken as OrdersDatatoken
} from '../@types/subgraph/OrdersData'
import { UserSalesQuery as UsersSalesList } from '../@types/subgraph/UserSalesQuery'
import { OpcFeesQuery as OpcFeesData } from '../@types/subgraph/OpcFeesQuery'
import axios from 'axios'

export interface UserLiquidity {
  price: string
  oceanBalance: string
}

export interface PriceList {
  [key: string]: string
}

const AssetPoolPriceQuery = gql`
  query AssetPoolPrice($datatokenAddress: String) {
    pools(where: { datatoken: $datatokenAddress }) {
      id
      spotPrice
      datatoken {
        address
        symbol
      }
      baseToken {
        symbol
      }
      datatokenLiquidity
      baseTokenLiquidity
    }
  }
`

const PreviousOrderQuery = gql`
  query AssetPreviousOrder($id: String!, $account: String!) {
    orders(
      first: 1
      where: { datatoken: $id, payer: $account }
      orderBy: createdTimestamp
      orderDirection: desc
    ) {
      createdTimestamp
      tx
    }
  }
`
const HighestLiquidityAssets = gql`
  query HighestLiquidityAssets {
    pools(
      where: { datatokenLiquidity_gte: 1 }
      orderBy: baseTokenLiquidity
      orderDirection: desc
      first: 15
    ) {
      id
      datatoken {
        address
      }
      baseToken {
        symbol
      }
      baseTokenLiquidity
      datatokenLiquidity
    }
  }
`

const UserSharesQuery = gql`
  query UserSharesQuery($user: String, $pools: [String!]) {
    poolShares(where: { user: $user, pool_in: $pools }) {
      id
      shares
      user {
        id
      }
      pool {
        id
        datatoken {
          address
          symbol
        }
        baseToken {
          address
          symbol
        }
        datatokenLiquidity
        baseTokenLiquidity
        totalShares
        spotPrice
        createdTimestamp
      }
    }
  }
`

const userPoolSharesQuery = gql`
  query PoolShares($user: String) {
    poolShares(where: { user: $user, shares_gt: 0.001 }, first: 1000) {
      id
      shares
      user {
        id
      }
      pool {
        id
        datatoken {
          id
          address
          symbol
        }
        baseToken {
          id
          address
          symbol
        }
        baseTokenLiquidity
        datatokenLiquidity
        totalShares
        spotPrice
        createdTimestamp
      }
    }
  }
`

const UserTokenOrders = gql`
  query OrdersData($user: String!) {
    orders(
      orderBy: createdTimestamp
      orderDirection: desc
      where: { consumer: $user }
    ) {
      consumer {
        id
      }
      datatoken {
        id
        address
        symbol
      }
      consumerMarketToken {
        address
        symbol
      }
      createdTimestamp
      tx
    }
  }
`

const UserSalesQuery = gql`
  query UserSalesQuery($user: String!) {
    users(where: { id: $user }) {
      id
      totalSales
    }
  }
`

// TODO: figure out some way to get this
const TopSalesQuery = gql`
  query TopSalesQuery {
    users(
      first: 20
      orderBy: tokensOwned
      orderDirection: desc
      where: { tokenBalancesOwned_not: "0" }
    ) {
      id
      tokenBalancesOwned {
        value
      }
    }
  }
`

const OpcFeesQuery = gql`
  query OpcFeesQuery($id: ID!) {
    opc(id: $id) {
      swapOceanFee
      swapNonOceanFee
      consumeFee
      providerFee
    }
  }
`

export function getSubgraphUri(chainId: number): string {
  const config = getOceanConfig(chainId)
  return config.subgraphUri
}

export function getQueryContext(chainId: number): OperationContext {
  try {
    const queryContext: OperationContext = {
      url: `${getSubgraphUri(
        Number(chainId)
      )}/subgraphs/name/oceanprotocol/ocean-subgraph`,
      requestPolicy: 'cache-and-network'
    }
    return queryContext
  } catch (error) {
    LoggerInstance.error('Get query context error: ', error.message)
  }
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
    LoggerInstance.error('Error fetchData: ', error.message)
  }
  return null
}

export async function fetchDataForMultipleChains(
  query: TypedDocumentNode,
  variables: any,
  chainIds: number[]
): Promise<any[]> {
  let datas: any[] = []
  try {
    for (const chainId of chainIds) {
      const context: OperationContext = getQueryContext(chainId)
      const response = await fetchData(query, variables, context)
      if (!response || response.error) continue
      datas = datas.concat(response?.data)
    }
    return datas
  } catch (error) {
    LoggerInstance.error('Error fetchData: ', error.message)
  }
}

export async function getOpcFees(chainId: number) {
  let opcFees
  const variables = {
    id: 1
  }
  const context = getQueryContext(chainId)
  try {
    const response: OperationResult<OpcFeesData> = await fetchData(
      OpcFeesQuery,
      variables,
      context
    )
    opcFees = response?.data?.opc
  } catch (error) {
    LoggerInstance.error('Error fetchData: ', error.message)
    throw Error(error.message)
  }
  return opcFees
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
  if (fetchedPreviousOrders.data?.orders?.length === 0) return null
  if (assetTimeout === '0') {
    return fetchedPreviousOrders?.data?.orders[0]?.tx
  } else {
    const expiry =
      fetchedPreviousOrders?.data?.orders[0]?.createdTimestamp * 1000 +
      Number(assetTimeout) * 1000
    if (Date.now() <= expiry) {
      return fetchedPreviousOrders?.data?.orders[0]?.tx
    } else {
      return null
    }
  }
}

export async function getSpotPrice(asset: Asset): Promise<number> {
  const poolVariables = {
    datatokenAddress: asset?.services[0].datatokenAddress.toLowerCase()
  }
  const queryContext = getQueryContext(Number(asset.chainId))

  const poolPriceResponse: OperationResult<AssetPoolPrice> = await fetchData(
    AssetPoolPriceQuery,
    poolVariables,
    queryContext
  )

  return poolPriceResponse.data.pools[0].spotPrice
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
      fetchedPools?.data?.pools
    )
  }
  highestLiquidityAssets.sort(
    (a, b) => b.baseTokenLiquidity - a.baseTokenLiquidity
  )

  for (let i = 0; i < highestLiquidityAssets.length; i++) {
    if (!highestLiquidityAssets[i]?.datatoken?.address) continue
    dtList.push(highestLiquidityAssets[i].datatoken.address)
  }
  return dtList
}

export function calculateUserLiquidity(poolShare: PoolShare): number {
  const ocean =
    (poolShare.shares / poolShare.pool.totalShares) *
    poolShare.pool.baseTokenLiquidity
  const datatokens =
    (poolShare.shares / poolShare.pool.totalShares) *
    poolShare.pool.datatokenLiquidity
  const totalLiquidity = ocean + datatokens * poolShare.pool.spotPrice
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
      const userShare = poolShare.shares / poolShare.pool.totalShares
      const userBalance = userShare * poolShare.pool.baseTokenLiquidity
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
  try {
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
  } catch (error) {
    LoggerInstance.error('Error fetchData: ', error.message)
  }
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
      tokenOrders[i].orders.forEach((tokenOrder: OrdersData) => {
        data.push(tokenOrder)
      })
    }

    return data
  } catch (error) {
    LoggerInstance.error(error.message)
  }
}

export async function getUserSales(
  accountId: string,
  chainIds: number[]
): Promise<number> {
  const variables = { user: accountId?.toLowerCase() }
  try {
    const userSales = await fetchDataForMultipleChains(
      UserSalesQuery,
      variables,
      chainIds
    )
    let salesSum = 0
    for (let i = 0; i < userSales.length; i++) {
      if (userSales[i].users.length > 0) {
        salesSum += parseInt(userSales[i].users[0].totalSales)
      }
    }
    return salesSum
  } catch (error) {
    LoggerInstance.error(error.message)
  }
}

export async function getTopAssetsPublishers(
  chainIds: number[],
  nrItems = 9
): Promise<AccountTeaserVM[]> {
  const publisherSales: AccountTeaserVM[] = []

  for (const chain of chainIds) {
    const queryContext = getQueryContext(Number(chain))
    const fetchedUsers: OperationResult<UsersSalesList> = await fetchData(
      TopSalesQuery,
      null,
      queryContext
    )
    for (let i = 0; i < fetchedUsers.data.users.length; i++) {
      const publishersIndex = publisherSales.findIndex(
        (user) => fetchedUsers.data.users[i].id === user.address
      )
      if (publishersIndex === -1) {
        const publisher: AccountTeaserVM = {
          address: fetchedUsers.data.users[i].id,
          nrSales: fetchedUsers.data.users[i].totalSales
        }
        publisherSales.push(publisher)
      } else {
        publisherSales[publishersIndex].nrSales +=
          publisherSales[publishersIndex].nrSales
      }
    }
  }

  publisherSales.sort((a, b) => b.nrSales - a.nrSales)

  return publisherSales.slice(0, nrItems)
}
