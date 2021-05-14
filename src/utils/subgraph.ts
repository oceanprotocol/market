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
import BigNumber from 'bignumber.js'

export interface PriceList {
  [key: string]: string
}

export interface AssetListPrices {
  datatokenAddress: string
  price: BestPrice
}

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
    const expiry = new BigNumber(
      fetchedPreviousOrders?.data?.tokenOrders[0]?.timestamp
    ).plus(assetTimeout)
    const unixTime = new BigNumber(Math.floor(Date.now() / 1000))
    if (unixTime.isLessThan(expiry)) {
      return fetchedPreviousOrders?.data?.tokenOrders[0]?.tx
    } else {
      return null
    }
  }
}

function transformPriceToBestPrice(
  frePrice: AssetsFrePriceFixedRateExchanges[],
  poolPrice: AssetsPoolPricePools[]
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

export async function getAssetPrices(assets: DDO[]): Promise<PriceList> {
  const priceList: PriceList = {}
  const didDTMap: { [name: string]: string } = {}
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
  const poolPriceResponse: ApolloQueryResult<AssetsPoolPrice> = await fetchData(
    PoolQuery,
    poolVariables
  )
  for (const poolPrice of poolPriceResponse.data?.pools) {
    priceList[didDTMap[poolPrice.datatokenAddress]] =
      poolPrice.consumePrice === '-1'
        ? poolPrice.spotPrice
        : poolPrice.consumePrice
  }
  const frePriceResponse: ApolloQueryResult<AssetsFrePrice> = await fetchData(
    FreQuery,
    freVariables
  )
  for (const frePrice of frePriceResponse.data?.fixedRateExchanges) {
    priceList[didDTMap[frePrice.datatoken?.address]] = frePrice.rate
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

  const poolPriceResponse: ApolloQueryResult<AssetsPoolPrice> = await fetchData(
    AssetPoolPriceQuerry,
    poolVariables
  )
  const frePriceResponse: ApolloQueryResult<AssetsFrePrice> = await fetchData(
    AssetFreQuery,
    freVariables
  )

  const bestPrice: BestPrice = transformPriceToBestPrice(
    frePriceResponse.data.fixedRateExchanges,
    poolPriceResponse.data.pools
  )

  return bestPrice
}

export async function getAssetsPrices(
  assets: DDO[]
): Promise<AssetListPrices[]> {
  const pricesList: AssetListPrices[] = []
  const didDTMap: { [name: string]: string } = {}
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

  const poolPriceResponse: ApolloQueryResult<AssetsPoolPrice> = await fetchData(
    PoolQuery,
    poolVariables
  )
  const frePriceResponse: ApolloQueryResult<AssetsFrePrice> = await fetchData(
    FreQuery,
    freVariables
  )

  for (const dataToken of dataTokenList) {
    const poolPrice: AssetsPoolPricePools[] = []
    const frePrice: AssetsFrePriceFixedRateExchanges[] = []
    const pool = poolPriceResponse.data?.pools.find(
      (pool: any) => pool.datatokenAddress === dataToken
    )
    pool && poolPrice.push(pool)
    const fre = frePriceResponse.data?.fixedRateExchanges.find(
      (fre: any) => fre.datatoken.address === dataToken
    )
    fre && frePrice.push(fre)
    const bestPrice = transformPriceToBestPrice(frePrice, poolPrice)
    pricesList.push({
      datatokenAddress: dataToken,
      price: bestPrice
    })
  }

  return pricesList
}
