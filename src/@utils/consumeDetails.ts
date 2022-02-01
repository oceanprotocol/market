import { gql, OperationResult } from 'urql'
import { fetchData, getQueryContext } from './subgraph'
import {
  TokenPriceQuery,
  TokenPriceQuery_token as TokenPrice
} from '../@types/subgraph/TokenPriceQuery'

const TokenPriceQuery = gql`
  query TokenPriceQuery($datatokenId: ID!, $account: String) {
    token(id: $datatokenId) {
      id
      symbol
      name
      orders(
        where: { consumer: $account }
        orderBy: createdTimestamp
        orderDirection: desc
      ) {
        tx
        serviceIndex
        createdTimestamp
      }
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

/**
 * returns various consume details for the desired datatoken
 * @param chain chain on witch the dt is preset
 * @param datatokenAddress address of the datatoken
 * @param timeout timeout of the service , only needed if you want order details like owned and validOrderId
 * @param account account that wants to consume, only needed if you want order details like owned and validOrderId
 * @returns ConsumeDetails
 */
export async function getConsumeDetails(
  chain: number,
  datatokenAddress: string,
  timeout?: number,
  account = ''
): Promise<ConsumeDetails> {
  const consumeDetails = {} as ConsumeDetails
  const queryContext = getQueryContext(Number(chain))
  const tokenQueryResult: OperationResult<TokenPriceQuery, any> =
    await fetchData(
      TokenPriceQuery,
      {
        datatokenId: datatokenAddress.toLowerCase(),
        account: account.toLowerCase()
      },
      queryContext
    )

  const tokenPrice: TokenPrice = tokenQueryResult.data.token

  if (!timeout && !tokenPrice.orders && tokenPrice.orders.length > 0) {
    const order = tokenPrice.orders[0]
    consumeDetails.owned = Date.now() / 1000 - order.createdTimestamp < timeout
    consumeDetails.validOrderTx = order.tx
  }

  // free is always the best price
  if (tokenPrice.dispensers && tokenPrice.dispensers.length > 0) {
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
    tokenPrice.fixedRateExchanges &&
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
  if (tokenPrice.pools && tokenPrice.pools.length > 0) {
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
