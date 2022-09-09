import { gql, OperationResult, TypedDocumentNode, OperationContext } from 'urql'
import { LoggerInstance } from '@oceanprotocol/lib'
import { getUrqlClientInstance } from '@context/UrqlProvider'
import { getOceanConfig } from './ocean'
import { AssetPreviousOrder } from '../@types/subgraph/AssetPreviousOrder'
import { OrdersData_orders as OrdersData } from '../@types/subgraph/OrdersData'
import { OpcFeesQuery as OpcFeesData } from '../@types/subgraph/OpcFeesQuery'

import { getPublishedAssets, getTopPublishers } from '@utils/aquarius'
export interface UserLiquidity {
  price: string
  oceanBalance: string
}

export interface PriceList {
  [key: string]: string
}

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

const OpcFeesQuery = gql`
  query OpcFeesQuery($id: ID!) {
    opc(id: $id) {
      swapOceanFee
      swapNonOceanFee
      orderFee
      providerFee
    }
  }
`

const OpcsApprovedTokensQuery = gql`
  query OpcsApprovedTokensQuery {
    opcs {
      approvedTokens {
        address: id
        symbol
        name
        decimals
      }
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
      requestPolicy: 'network-only'
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
    LoggerInstance.error('Error fetchDataForMultipleChains: ', error.message)
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
    LoggerInstance.error('Error getOpcFees: ', error.message)
    throw Error(error.message)
  }
  return opcFees
}

export async function getPreviousOrders(
  id: string,
  account: string,
  assetTimeout: string
): Promise<string> {
  const variables = { id, account }
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
    LoggerInstance.error('Error getUserTokenOrders', error.message)
  }
}

export async function getUserSales(
  accountId: string,
  chainIds: number[]
): Promise<number> {
  try {
    const result = await getPublishedAssets(accountId, chainIds, null)
    const { totalOrders } = result.aggregations
    return totalOrders.value
  } catch (error) {
    LoggerInstance.error('Error getUserSales', error.message)
  }
}

export async function getTopAssetsPublishers(
  chainIds: number[],
  nrItems = 9
): Promise<AccountTeaserVM[]> {
  const publishers: AccountTeaserVM[] = []

  const result = await getTopPublishers(chainIds, null)
  const { topPublishers } = result.aggregations

  for (let i = 0; i < topPublishers.buckets.length; i++) {
    publishers.push({
      address: topPublishers.buckets[i].key,
      nrSales: parseInt(topPublishers.buckets[i].totalSales.value)
    })
  }

  publishers.sort((a, b) => b.nrSales - a.nrSales)

  return publishers.slice(0, nrItems)
}

export async function getOpcsApprovedTokens(
  chainId: number
): Promise<TokenInfo[]> {
  const context = getQueryContext(chainId)

  try {
    const response = await fetchData(OpcsApprovedTokensQuery, null, context)
    return response?.data?.opcs[0].approvedTokens
  } catch (error) {
    LoggerInstance.error('Error getOpcsApprovedTokens: ', error.message)
    throw Error(error.message)
  }
}
