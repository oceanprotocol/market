import { gql } from 'urql'

const TokenPriceQuery = gql`
  query TokenPriceQuery($datatokenId: ID!) {
    token(id: $datatokenId) {
      id
      symbol
      name
      dispensers {
        id
        active
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

export async function getPrice(): Promise<BestPrice> {
  const price = {} as BestPrice
  return price
}
