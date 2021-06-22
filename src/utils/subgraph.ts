import { gql, OperationResult, TypedDocumentNode } from 'urql'
import { DDO, BestPrice } from '@oceanprotocol/lib'
import { getUrqlClientInstance } from '../providers/UrqlProvider'
import {
  AssetsPoolPrice,
  AssetsPoolPrice_pools as AssetsPoolPricePools
} from '../@types/apollo/AssetsPoolPrice'
import {
  AssetsFrePrice,
  AssetsFrePrice_fixedRateExchanges as AssetsFrePriceFixedRateExchanges
} from '../@types/apollo/AssetsFrePrice'
import { AssetPreviousOrder } from '../@types/apollo/AssetPreviousOrder'
import web3 from 'web3'

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

async function fetchData(
  query: TypedDocumentNode,
  variables: any
): Promise<OperationResult> {
  try {
    const client = getUrqlClientInstance()
    const response = await client.query(query, variables).toPromise()
    console.log('resp == ', response)
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
  const fetchedPreviousOrders: OperationResult<AssetPreviousOrder> =
    await fetchData(PreviousOrderQuery, variables)
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

async function getAssetsPoolsExchangesAndDatatokenMap(
  assets: DDO[]
): Promise<
  [
    OperationResult<AssetsPoolPrice>,
    OperationResult<AssetsFrePrice>,
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

  const poolPriceResponse: OperationResult<AssetsPoolPrice> = await fetchData(
    PoolQuery,
    poolVariables
  )
  const frePriceResponse: OperationResult<AssetsFrePrice> = await fetchData(
    FreQuery,
    freVariables
  )

  return [poolPriceResponse, frePriceResponse, didDTMap]
}

export async function getAssetsPriceList(assets: DDO[]): Promise<PriceList> {
  const priceList: PriceList = {}

  const values: [
    OperationResult<AssetsPoolPrice>,
    OperationResult<AssetsFrePrice>,
    DidAndDatatokenMap
  ] = await getAssetsPoolsExchangesAndDatatokenMap(assets)
  const poolPriceResponse = values[0]
  const frePriceResponse = values[1]
  const didDTMap: DidAndDatatokenMap = values[2]

  console.log('poolPriceResponse ++ ', poolPriceResponse)
  for (const poolPrice of poolPriceResponse.data?.pools) {
    priceList[didDTMap[poolPrice.datatokenAddress]] =
      poolPrice.consumePrice === '-1'
        ? poolPrice.spotPrice
        : poolPrice.consumePrice
  }
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

  const poolPriceResponse: OperationResult<AssetsPoolPrice> = await fetchData(
    AssetPoolPriceQuerry,
    poolVariables
  )
  const frePriceResponse: OperationResult<AssetsFrePrice> = await fetchData(
    AssetFreQuery,
    freVariables
  )

  console.log('poolPriceResponse 2 -- ', poolPriceResponse)
  const bestPrice: BestPrice = transformPriceToBestPrice(
    frePriceResponse.data.fixedRateExchanges,
    poolPriceResponse.data.pools
  )

  return bestPrice
}

export async function getAssetsBestPrices(
  assets: DDO[]
): Promise<AssetListPrices[]> {
  const assetsWithPrice: AssetListPrices[] = []

  const values: [
    OperationResult<AssetsPoolPrice>,
    OperationResult<AssetsFrePrice>,
    DidAndDatatokenMap
  ] = await getAssetsPoolsExchangesAndDatatokenMap(assets)
  const poolPriceResponse = values[0]
  const frePriceResponse = values[1]

  console.log('poolPriceResponse 3 || ', poolPriceResponse)

  for (const ddo of assets) {
    const dataToken = ddo.dataToken.toLowerCase()
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
    assetsWithPrice.push({
      ddo: ddo,
      price: bestPrice
    })
  }

  return assetsWithPrice
}

export async function getHighestLiquidityDIDs(): Promise<string> {
  const didList: string[] = []
  const fetchedPools = await fetchData(HighestLiquidityAssets, null)
  if (fetchedPools.data?.pools?.length === 0) return null
  for (let i = 0; i < fetchedPools.data.pools.length; i++) {
    if (!fetchedPools.data.pools[i].datatokenAddress) continue
    const did = web3.utils
      .toChecksumAddress(fetchedPools.data.pools[i].datatokenAddress)
      .replace('0x', 'did:op:')
    didList.push(did)
  }
  const searchDids = JSON.stringify(didList)
    .replace(/,/g, ' ')
    .replace(/"/g, '')
    .replace(/(\[|\])/g, '')
    .replace(/(did:op:)/g, '0x')
  return searchDids
}
