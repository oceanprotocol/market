import { gql, DocumentNode, ApolloQueryResult } from '@apollo/client'
import { DDO } from '@oceanprotocol/lib'
import { getApolloClientInstance } from '../providers/ApolloClientProvider'
import BigNumber from 'bignumber.js'

export interface PriceList {
  [key: string]: string
}

const freQuery = gql`
  query AssetFrePrice($datatoken_in: [String!]) {
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

const poolQuery = gql`
  query AssetPoolPrice($datatokenAddress_in: [String!]) {
    pools(where: { datatokenAddress_in: $datatokenAddress_in }) {
      spotPrice
      consumePrice
      id
      datatokenAddress
    }
  }
`

const previousOrderQuery = gql`
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
      variables: variables
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
  const fetchedPreviousOrders: any = await fetchData(
    previousOrderQuery,
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

export async function getAssetPrices(assets: DDO[]): Promise<PriceList> {
  const priceList: PriceList = {}
  const didDTMap: any = {}
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
  const poolPriceResponse: any = await fetchData(poolQuery, poolVariables)
  for (const poolPrice of poolPriceResponse.data?.pools) {
    priceList[didDTMap[poolPrice.datatokenAddress]] =
      poolPrice.consumePrice === '-1'
        ? poolPrice.spotPrice
        : poolPrice.consumePrice
  }
  const frePriceResponse: any = await fetchData(freQuery, freVariables)
  for (const frePrice of frePriceResponse.data?.fixedRateExchanges) {
    priceList[didDTMap[frePrice.datatoken?.address]] = frePrice.rate
  }
  return priceList
}
