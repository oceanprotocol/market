import { gql, OperationResult } from 'urql'
import { fetchData, getQueryContext } from './subgraph'
import {
  TokenPriceQuery,
  TokenPriceQuery_token as TokenPrice
} from '../@types/subgraph/TokenPriceQuery'
import {
  TokensPriceQuery,
  TokensPriceQuery_tokens as TokensPrice
} from '../@types/subgraph/TokensPriceQuery'
import { Asset } from '@oceanprotocol/lib'
import { AssetExtended } from 'src/@types/AssetExtended'

const TokensPriceQuery = gql`
  query TokensPriceQuery($datatokenIds: [ID!], $account: String) {
    tokens(where: { id_in: $datatokenIds }) {
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

function getAccessDetailsFromTokenPrice(
  tokenPrice: TokenPrice | TokensPrice,
  timeout?: number
): AccessDetails {
  const accessDetails = {} as AccessDetails
  if (timeout && tokenPrice.orders && tokenPrice.orders.length > 0) {
    const order = tokenPrice.orders[0]
    accessDetails.isOwned = Date.now() / 1000 - order.createdTimestamp < timeout
    accessDetails.validOrderTx = order.tx
  }

  // free is always the best price
  if (tokenPrice.dispensers && tokenPrice.dispensers.length > 0) {
    const dispenser = tokenPrice.dispensers[0]
    accessDetails.type = 'free'
    accessDetails.addressOrId = dispenser.id
    accessDetails.price = 0
    accessDetails.isPurchasable = dispenser.active
    accessDetails.datatoken = {
      address: dispenser.token.id,
      name: dispenser.token.name,
      symbol: dispenser.token.symbol
    }
    return accessDetails
  }

  // checking for fixed price
  if (
    tokenPrice.fixedRateExchanges &&
    tokenPrice.fixedRateExchanges.length > 0
  ) {
    const fre = tokenPrice.fixedRateExchanges[0]
    accessDetails.type = 'fixed'
    accessDetails.addressOrId = fre.id
    accessDetails.price = fre.price
    // in theory we should check dt balance here, we can skip this because in the market we always create fre with minting capabilities.
    accessDetails.isPurchasable = fre.active
    accessDetails.baseToken = {
      address: fre.baseToken.address,
      name: fre.baseToken.name,
      symbol: fre.baseToken.symbol
    }
    accessDetails.datatoken = {
      address: fre.datatoken.address,
      name: fre.datatoken.name,
      symbol: fre.datatoken.symbol
    }
    return accessDetails
  }

  // checking for pools
  if (tokenPrice.pools && tokenPrice.pools.length > 0) {
    const pool = tokenPrice.pools[0]
    accessDetails.type = 'dynamic'
    accessDetails.addressOrId = pool.id
    accessDetails.price = pool.spotPrice
    // TODO: pool.datatokenLiquidity > 3 is kinda random here, we shouldn't run into this anymore now , needs more thinking/testing
    accessDetails.isPurchasable =
      pool.isFinalized && pool.datatokenLiquidity > 3
    accessDetails.baseToken = {
      address: pool.baseToken.address,
      name: pool.baseToken.name,
      symbol: pool.baseToken.symbol
    }
    accessDetails.datatoken = {
      address: pool.datatoken.address,
      name: pool.datatoken.name,
      symbol: pool.datatoken.symbol
    }
    return accessDetails
  }
  return accessDetails
}

/**
 * returns various consume details for the desired datatoken
 * @param chain chain on which the datatoken is preset
 * @param datatokenAddress address of the datatoken
 * @param timeout timeout of the service, only needed if you want order details like owned and validOrderId
 * @param account account that wants to consume, only needed if you want order details like owned and validOrderId
 * @returns AccessDetails
 */
export async function getAccessDetails(
  chain: number,
  datatokenAddress: string,
  timeout?: number,
  account = ''
): Promise<AccessDetails> {
  const queryContext = getQueryContext(Number(chain))
  const tokenQueryResult: OperationResult<
    TokenPriceQuery,
    { datatokenId: string; account: string }
  > = await fetchData(
    TokenPriceQuery,
    {
      datatokenId: datatokenAddress.toLowerCase(),
      account: account.toLowerCase()
    },
    queryContext
  )

  const tokenPrice: TokenPrice = tokenQueryResult.data.token
  const accessDetails = getAccessDetailsFromTokenPrice(tokenPrice, timeout)
  return accessDetails
}

export async function getAccessDetailsForAssets(
  assets: Asset[],
  account = ''
): Promise<AssetExtended[]> {
  const assetsExtended: AssetExtended[] = assets
  const chainAssetLists: { [key: number]: string[] } = {}

  for (const asset of assets) {
    //  harcoded until we have chainId on assets
    if (chainAssetLists[asset.chainId]) {
      chainAssetLists[asset.chainId].push(
        asset?.services[0].datatokenAddress.toLowerCase()
      )
    } else {
      chainAssetLists[asset.chainId] = []
      chainAssetLists[asset.chainId].push(
        asset?.services[0].datatokenAddress.toLowerCase()
      )
    }
  }

  for (const chainKey in chainAssetLists) {
    const queryContext = getQueryContext(Number(chainKey))
    const tokenQueryResult: OperationResult<
      TokensPriceQuery,
      { datatokenId: string; account: string }
    > = await fetchData(
      TokensPriceQuery,
      {
        datatokenIds: chainAssetLists[chainKey],
        account: account.toLowerCase()
      },
      queryContext
    )
    tokenQueryResult.data?.tokens.forEach((token) => {
      const accessDetails = getAccessDetailsFromTokenPrice(token)
      const currentAsset = assetsExtended.find(
        (asset) => asset.services[0].datatokenAddress.toLowerCase() === token.id
      )
      currentAsset.accessDetails = accessDetails
    })
  }
  return assetsExtended
}
