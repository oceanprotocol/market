import { gql, DocumentNode } from '@apollo/client'
import { FrePrice } from '../@types/apollo/FrePrice'
import { PoolPrice } from '../@types/apollo/PoolPrice'
import { DDO } from '@oceanprotocol/lib'
import { getApolloClientInstance } from '../providers/ApolloClientProvider'

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
      id
      datatokenAddress
    }
  }
`

async function fetchData(
  query: DocumentNode,
  variables: any
): Promise<ApolloQueryResult> {
  try {
    const client = getApolloClientInstance()
    const response = await client.query({
      query: query,
      variables: variables
    })
    return response
  } catch (error) {
    console.error('Error parsing json: ', error)
  }
}

export async function getAssetPrice(assets: DDO[]): Promise<any> {
  const priceList: any = {}
  const poolPriceAssets: string[] = []
  const poolDTadressDID: any = {}
  const frePriceAssets: string[] = []
  const freDTadressDID: any = {}
  for (const ddo: DDO of assets) {
    if (ddo.price?.type === 'pool') {
      poolDTadressDID[ddo?.dataToken.toLowerCase()] = ddo.id
      poolPriceAssets.push(ddo?.dataToken.toLowerCase())
    } else if (ddo.price?.type === 'exchange') {
      freDTadressDID[ddo?.dataToken.toLowerCase()] = ddo.id
      frePriceAssets.push(ddo?.dataToken.toLowerCase())
    }
  }
  const freVariables = {
    datatoken_in: frePriceAssets
  }
  const poolVariables = {
    datatokenAddress_in: poolPriceAssets
  }
  const poolPriceResponse: any = await fetchData(poolQuery, poolVariables)
  console.log('poolPriceResponse', poolPriceResponse)
  for (const poolPirce of poolPriceResponse.data?.pools) {
    priceList[poolDTadressDID[poolPirce.datatokenAddress]] = poolPirce.spotPrice
  }
  const frePriceResponse: any = await fetchData(freQuery, freVariables)
  console.log('frePriceResponse', frePriceResponse)
  for (const frePrice of frePriceResponse.data?.fixedRateExchanges) {
    priceList[freDTadressDID[frePrice.datatoken?.address]] = frePrice.rate
  }
  return priceList
}
