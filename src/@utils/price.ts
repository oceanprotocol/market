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
        id
        price
        baseToken {
          symbol
          name
          address
        }
        datatoken {
          symbol
          name
          address
        }
        active
      }
      pools {
        id
        spotPrice
        isFinalized
        datatokenLiquidity
        baseToken {
          symbol
          name
          address
        }
        datatoken {
          symbol
          name
          address
        }
      }
    }
  }
`

// TODO: orders to be added in query after subgraph update, as well as owned property
export async function getPrice(
  chain: number,
  datatokenAddress: string
): Promise<ConsumeDetails> {
  const consumeDetails = {} as ConsumeDetails
  const queryContext = getQueryContext(Number(chain))
  const tokenQueryResult: OperationResult<TokenPriceQuery, any> =
    await fetchData(
      TokenPriceQuery,
      { datatoken: datatokenAddress },
      queryContext
    )
  const tokenPrice: TokenPrice = tokenQueryResult.data.token

  // free is always the best price
  if (tokenPrice.dispensers !== null && tokenPrice.dispensers.length > 0) {
    const dispenser = tokenPrice.dispensers[0]
    consumeDetails.type = 'free'
    consumeDetails.addressOrId = dispenser.id
    consumeDetails.price = 0
    consumeDetails.isConsumable = dispenser.active
    consumeDetails.datatoken = {
      address: dispenser.token.id,
      name: dispenser.token.name,
      symbol: dispenser.token.symbol
    }
    return consumeDetails
  }

  // checking for fixed price
  if (
    tokenPrice.fixedRateExchanges !== null &&
    tokenPrice.fixedRateExchanges.length > 0
  ) {
    const fre = tokenPrice.fixedRateExchanges[0]
    consumeDetails.type = 'fixed'
    consumeDetails.addressOrId = fre.id
    consumeDetails.price = fre.price
    // in theory we should check dt balance here, we can skip this because in the market we always create fre with minting capabilities.
    consumeDetails.isConsumable = fre.active
    consumeDetails.baseToken = {
      address: fre.baseToken.address,
      name: fre.baseToken.name,
      symbol: fre.baseToken.symbol
    }
    consumeDetails.datatoken = {
      address: fre.datatoken.address,
      name: fre.datatoken.name,
      symbol: fre.datatoken.symbol
    }
    return consumeDetails
  }

  // checking for pools
  if (tokenPrice.pools !== null && tokenPrice.pools.length > 0) {
    const pool = tokenPrice.pools[0]
    consumeDetails.type = 'dynamic'
    consumeDetails.addressOrId = pool.id
    consumeDetails.price = pool.spotPrice
    // TODO: pool.datatokenLiquidity > 3 is kinda random here, we shouldn't run into this anymore now , needs more thinking/testing
    consumeDetails.isConsumable =
      pool.isFinalized && pool.datatokenLiquidity > 3
    consumeDetails.baseToken = {
      address: pool.baseToken.address,
      name: pool.baseToken.name,
      symbol: pool.baseToken.symbol
    }
    consumeDetails.datatoken = {
      address: pool.datatoken.address,
      name: pool.datatoken.name,
      symbol: pool.datatoken.symbol
    }
    return consumeDetails
  }
  return consumeDetails
}
