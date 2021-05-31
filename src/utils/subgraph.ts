import { gql, DocumentNode, ApolloQueryResult } from '@apollo/client'
import { DDO, BestPrice } from '@oceanprotocol/lib'
import { getApolloClientInstance } from '../providers/ApolloClientProvider'
import {
  AssetsPoolPrice,
  AssetsPoolPrice_pools as AssetsPoolPricePools
} from '../@types/apollo/AssetsPoolPrice'
import {
  AssetsFrePrice,
  AssetsFrePrice_fixedRateExchanges as AssetsFrePriceFixedRateExchanges
} from '../@types/apollo/AssetsFrePrice'
import { AssetPreviousOrder } from '../@types/apollo/AssetPreviousOrder'
import {
  AssetsFreePrice,
  AssetsFreePrice_dispensers as AssetFreePriceDispenser
} from '../@types/apollo/AssetsFreePrice'

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

async function fetchData(
  query: DocumentNode,
  variables: any
): Promise<ApolloQueryResult<any>> {
  try {
    const client = getApolloClientInstance()
    const response = await client.query({
      query: query,
      variables: variables,
      fetchPolicy: 'no-cache'
    })
    return response
  } catch (error) {
    console.error('Error fetchData: ', error.message)
  }
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
  const fetchedPreviousOrders: ApolloQueryResult<AssetPreviousOrder> = await fetchData(
    PreviousOrderQuery,
    variables
  )
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
    ApolloQueryResult<AssetsPoolPrice>,
    ApolloQueryResult<AssetsFrePrice>,
    ApolloQueryResult<AssetsFreePrice>,
    DidAndDatatokenMap
  ]
> {
  const didDTMap: DidAndDatatokenMap = {}
  const dataTokenList: string[] = []

  for (const ddo of assets) {
    didDTMap[ddo?.dataToken.toLowerCase()] = ddo.id
    dataTokenList.push(ddo?.dataToken.toLowerCase())
  }
  const freVariables = {
    datatoken_in: dataTokenList
  }
  const poolVariables = {
    datatokenAddress_in: dataTokenList
  }

  const freeVariables = {
    datatoken_in: dataTokenList
  }

  const poolPriceResponse: ApolloQueryResult<AssetsPoolPrice> = await fetchData(
    PoolQuery,
    poolVariables
  )
  const frePriceResponse: ApolloQueryResult<AssetsFrePrice> = await fetchData(
    FreQuery,
    freVariables
  )

  const freePriceResponse: ApolloQueryResult<AssetsFreePrice> = await fetchData(
    FreeQuery,
    freeVariables
  )

  return [poolPriceResponse, frePriceResponse, freePriceResponse, didDTMap]
}

export async function getAssetsPriceList(assets: DDO[]): Promise<PriceList> {
  const priceList: PriceList = {}

  const values: [
    ApolloQueryResult<AssetsPoolPrice>,
    ApolloQueryResult<AssetsFrePrice>,
    ApolloQueryResult<AssetsFreePrice>,
    DidAndDatatokenMap
  ] = await getAssetsPoolsExchangesAndDatatokenMap(assets)
  const poolPriceResponse = values[0]
  const frePriceResponse = values[1]
  const freePriceResponse = values[2]
  const didDTMap: DidAndDatatokenMap = values[3]

  for (const poolPrice of poolPriceResponse.data?.pools) {
    priceList[didDTMap[poolPrice.datatokenAddress]] =
      poolPrice.consumePrice === '-1'
        ? poolPrice.spotPrice
        : poolPrice.consumePrice
  }
  for (const frePrice of frePriceResponse.data?.fixedRateExchanges) {
    priceList[didDTMap[frePrice.datatoken?.address]] = frePrice.rate
  }
  for (const freePrice of freePriceResponse.data?.dispensers) {
    priceList[didDTMap[freePrice.datatoken?.address]] = '0'
  }
  return priceList
}

export async function getPrice(asset: DDO): Promise<BestPrice> {
  const freVariables = {
    datatoken: asset?.dataToken.toLowerCase()
  }

  const poolVariables = {
    datatokenAddress: asset?.dataToken.toLowerCase()
  }

  const freeVariables = {
    datatoken: asset?.dataToken.toLowerCase()
  }

  const poolPriceResponse: ApolloQueryResult<AssetsPoolPrice> = await fetchData(
    AssetPoolPriceQuerry,
    poolVariables
  )
  const frePriceResponse: ApolloQueryResult<AssetsFrePrice> = await fetchData(
    AssetFreQuery,
    freVariables
  )
  const freePriceResponse: ApolloQueryResult<AssetsFreePrice> = await fetchData(
    AssetFreeQuery,
    freeVariables
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
    ApolloQueryResult<AssetsPoolPrice>,
    ApolloQueryResult<AssetsFrePrice>,
    ApolloQueryResult<AssetsFreePrice>,
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
    const pool = poolPriceResponse.data?.pools.find(
      (pool: any) => pool.datatokenAddress === dataToken
    )
    pool && poolPrice.push(pool)
    const fre = frePriceResponse.data?.fixedRateExchanges.find(
      (fre: any) => fre.datatoken.address === dataToken
    )
    fre && frePrice.push(fre)
    const free = freePriceResponse.data?.dispensers.find(
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
