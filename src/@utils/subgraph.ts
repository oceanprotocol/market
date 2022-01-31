import { gql, OperationResult, TypedDocumentNode, OperationContext } from 'urql'
import { Asset, LoggerInstance } from '@oceanprotocol/lib'
import { getUrqlClientInstance } from '@context/UrqlProvider'
import { getOceanConfig } from './ocean'
import {
  AssetsPoolPrice,
  AssetsPoolPrice_pools as AssetsPoolPricePool
} from '../@types/subgraph/AssetsPoolPrice'
import {
  AssetsFrePrice,
  AssetsFrePrice_fixedRateExchanges as AssetsFrePriceFixedRateExchange
} from '../@types/subgraph/AssetsFrePrice'
import {
  AssetsFreePrice,
  AssetsFreePrice_dispensers as AssetFreePriceDispenser
} from '../@types/subgraph/AssetsFreePrice'
import { AssetPreviousOrder } from '../@types/subgraph/AssetPreviousOrder'
import {
  HighestLiquidityAssets_pools as HighestLiquidityAssetsPool,
  HighestLiquidityAssets as HighestLiquidityGraphAssets
} from '../@types/subgraph/HighestLiquidityAssets'
import {
  PoolShares as PoolSharesList,
  PoolShares_poolShares as PoolShare
} from '../@types/subgraph/PoolShares'
import { OrdersData_orders as OrdersData } from '../@types/subgraph/OrdersData'
import { UserSalesQuery as UsersSalesList } from '../@types/subgraph/UserSalesQuery'
import { PoolData } from 'src/@types/subgraph/PoolData'

export interface UserLiquidity {
  price: string
  oceanBalance: string
}

export interface PriceList {
  [key: string]: string
}

export interface AssetListPrices {
  ddo: Asset
  price: BestPrice
}

interface DidAndDatatokenMap {
  [name: string]: string
}

const FreeQuery = gql`
  query AssetsFreePrice($datatoken_in: [String!]) {
    dispensers(orderBy: id, where: { token_in: $datatoken_in }) {
      token {
        id
        address
      }
    }
  }
`

const AssetFreeQuery = gql`
  query AssetFreePrice($datatoken: String) {
    dispensers(orderBy: id, where: { token: $datatoken }) {
      active
      owner
      isMinter
      maxTokens
      maxBalance
      balance
      token {
        id
        isDatatoken
      }
    }
  }
`

const FreQuery = gql`
  query AssetsFrePrice($datatoken_in: [String!]) {
    fixedRateExchanges(orderBy: id, where: { datatoken_in: $datatoken_in }) {
      id
      price
      baseToken {
        symbol
      }
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
      id
      price
      baseToken {
        symbol
      }
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
    pools(where: { datatoken_in: $datatokenAddress_in }) {
      id
      spotPrice
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
    }
  }
`

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
      datatoken {
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

// TODO: counting orders might be enough here to get sales for a user
const UserSalesQuery = gql`
  query UserSalesQuery($userSalesId: ID) {
    users(where: { id: $userSalesId }) {
      id
      orders(first: 10000) {
        id
      }
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

const poolDataQuery = gql`
  query PoolData(
    $pool: ID!
    $poolAsString: String!
    $owner: String!
    $user: String
  ) {
    poolData: pool(id: $pool) {
      id
      totalShares
      poolFee
      opfFee
      marketFee
      spotPrice
      baseToken {
        address
        symbol
      }
      baseTokenWeight
      baseTokenLiquidity
      datatoken {
        address
        symbol
      }
      datatokenWeight
      datatokenLiquidity
      shares(where: { user: $owner }) {
        shares
      }
    }
    poolDataUser: pool(id: $pool) {
      shares(where: { user: $user }) {
        shares
      }
    }
    poolSnapshots(first: 1000, where: { pool: $poolAsString }, orderBy: date) {
      date
      spotPrice
      baseTokenLiquidity
      datatokenLiquidity
      swapVolume
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

function transformPriceToBestPrice(
  frePrice: AssetsFrePriceFixedRateExchange[],
  poolPrice: AssetsPoolPricePool[],
  freePrice: AssetFreePriceDispenser[]
) {
  if (poolPrice?.length > 0) {
    const price: BestPrice = {
      type: 'dynamic',
      address: poolPrice[0]?.id,
      value: poolPrice[0]?.spotPrice,
      ocean: poolPrice[0]?.baseTokenLiquidity,
      oceanSymbol: poolPrice[0]?.baseToken.symbol,
      datatoken: poolPrice[0]?.datatokenLiquidity,
      pools: [poolPrice[0]?.id],
      isConsumable: poolPrice[0]?.spotPrice === '-1' ? 'false' : 'true'
    }
    return price
  } else if (frePrice?.length > 0) {
    // TODO Hacky hack, temporary™: set isConsumable to true for fre assets.
    // isConsumable: 'true'
    const price: BestPrice = {
      type: 'fixed',
      value: frePrice[0]?.price,
      address: frePrice[0]?.id,
      exchangeId: frePrice[0]?.id,
      oceanSymbol: frePrice[0]?.baseToken.symbol,
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
      address: freePrice[0]?.token.id,
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
  assets: Asset[]
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
    didDTMap[ddo?.services[0].datatokenAddress.toLowerCase()] = ddo.id
    //  harcoded until we have chainId on assets
    if (chainAssetLists[ddo.chainId]) {
      chainAssetLists[ddo.chainId].push(
        ddo?.services[0].datatokenAddress.toLowerCase()
      )
    } else {
      chainAssetLists[ddo.chainId] = []
      chainAssetLists[ddo.chainId].push(
        ddo?.services[0].datatokenAddress.toLowerCase()
      )
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

export async function getAssetsPriceList(assets: Asset[]): Promise<PriceList> {
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
    priceList[didDTMap[poolPrice.datatoken.address]] = poolPrice.spotPrice
  }
  for (const frePrice of frePriceResponse) {
    priceList[didDTMap[frePrice.datatoken?.address]] = frePrice.price
  }
  for (const freePrice of freePriceResponse) {
    priceList[didDTMap[freePrice.token?.address]] = '0'
  }
  return priceList
}

export async function getPrice(asset: Asset): Promise<BestPrice> {
  const freVariables = {
    datatoken: asset?.services[0].datatokenAddress.toLowerCase()
  }
  const freeVariables = {
    datatoken: asset?.services[0].datatokenAddress.toLowerCase()
  }
  const poolVariables = {
    datatokenAddress: asset?.services[0].datatokenAddress.toLowerCase()
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

export async function getSpotPrice(asset: Asset): Promise<number> {
  const poolVariables = {
    datatokenAddress: asset?.services[0].datatokenAddress.toLowerCase()
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
  assets: Asset[]
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
    const dataToken = ddo.services[0].datatokenAddress.toLowerCase()
    const poolPrice: AssetsPoolPricePool[] = []
    const frePrice: AssetsFrePriceFixedRateExchange[] = []
    const freePrice: AssetFreePriceDispenser[] = []
    const pool = poolPriceResponse.find(
      (pool: AssetsPoolPricePool) => pool.datatoken.address === dataToken
    )
    pool && poolPrice.push(pool)
    const fre = frePriceResponse.find(
      (fre: AssetsFrePriceFixedRateExchange) =>
        fre.datatoken.address === dataToken
    )
    fre && frePrice.push(fre)
    const free = freePriceResponse.find(
      (free: AssetFreePriceDispenser) => free.token.address === dataToken
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
  highestLiquidityAssets.sort(
    (a, b) => b.baseTokenLiquidity - a.baseTokenLiquidity
  )
  for (let i = 0; i < highestLiquidityAssets.length; i++) {
    if (!highestLiquidityAssets[i].datatoken.address) continue
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
    LoggerInstance.error(error.message)
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
    LoggerInstance.log(error.message)
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
          nrSales: fetchedUsers.data.users[i].orders.length
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

export async function getPoolData(
  chainId: number,
  pool: string,
  owner: string,
  user: string
) {
  const queryVariables = {
    // Using `pool` & `poolAsString` is a workaround to make the mega query work.
    // See https://github.com/oceanprotocol/ocean-subgraph/issues/301
    pool: pool.toLowerCase(),
    poolAsString: pool.toLowerCase(),
    owner: owner.toLowerCase(),
    user: user.toLowerCase()
  }

  const response: OperationResult<PoolData> = await fetchData(
    poolDataQuery,
    queryVariables,
    getQueryContext(chainId)
  )
  return response?.data
}
