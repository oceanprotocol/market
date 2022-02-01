import { gql, OperationResult } from 'urql'
import { fetchData, getQueryContext } from './subgraph'
import {
  TokenPriceQuery,
  TokenPriceQuery_token as TokenPrice
} from '../@types/subgraph/TokenPriceQuery'

const TokenPriceQuery = gql`
  query TokenPriceQuery($datatokenId: ID!) {
    token(id: $datatokenId) {
      id
      symbol
      name
      dispensers {
        id
        active
        isMinter
        maxBalance
        token {
          id
          name
          symbol
        }
      }
      fixedRateExchanges {
        price
        baseToken {
          symbol
          name
          address
        }
        active
      }
      pools {
        id
        spotPrice
        baseToken {
          symbol
          name
          address
        }
      }
    }
  }
`

export async function getPrice(
  chain: number,
  datatokenAddress: string
): Promise<ConsumeDetails> {
  const price = {} as ConsumeDetails
  const queryContext = getQueryContext(Number(chain))
  const tokenQueryResult: OperationResult<TokenPriceQuery, any> =
    await fetchData(
      TokenPriceQuery,
      { datatoken: datatokenAddress },
      queryContext
    )
  const tokenPrice: TokenPrice = tokenQueryResult.data.token

  return price
}
