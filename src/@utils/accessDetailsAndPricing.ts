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
import { Asset, ProviderInstance } from '@oceanprotocol/lib'
import { AssetExtended } from 'src/@types/AssetExtended'
import { calculateBuyPrice } from './pool'
import { getFixedBuyPrice } from './fixedRateExchange'
import { getSiteMetadata } from './siteConfig'
import { AccessDetails, OrderPriceAndFees } from 'src/@types/Price'
import Decimal from 'decimal.js'

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

// TODO: fill in fees after subgraph update
function getAccessDetailsFromTokenPrice(
  tokenPrice: TokenPrice | TokensPrice,
  timeout?: number
): AccessDetails {
  const accessDetails = {} as AccessDetails
  if (
    tokenPrice &&
    timeout &&
    tokenPrice.orders &&
    tokenPrice.orders.length > 0
  ) {
    const order = tokenPrice.orders[0]
    accessDetails.isOwned = Date.now() / 1000 - order.createdTimestamp < timeout
    accessDetails.validOrderTx = order.tx
  }

  // TODO: fetch order fee from sub query
  accessDetails.publisherMarketOrderFee = '0'

  // free is always the best price
  if (tokenPrice.dispensers && tokenPrice.dispensers.length > 0) {
    const dispenser = tokenPrice.dispensers[0]
    accessDetails.type = 'free'
    accessDetails.addressOrId = dispenser.id
    accessDetails.price = '0'
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
    const fixed = tokenPrice.fixedRateExchanges[0]
    accessDetails.type = 'fixed'
    accessDetails.addressOrId = fixed.id
    accessDetails.price = fixed.price
    // in theory we should check dt balance here, we can skip this because in the market we always create fre with minting capabilities.
    accessDetails.isPurchasable = fixed.active
    accessDetails.baseToken = {
      address: fixed.baseToken.address,
      name: fixed.baseToken.name,
      symbol: fixed.baseToken.symbol
    }
    accessDetails.datatoken = {
      address: fixed.datatoken.address,
      name: fixed.datatoken.name,
      symbol: fixed.datatoken.symbol
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
 * This will be used to get price including feed before ordering
 * @param {AssetExtended} asset
 * @return {Promise<OrdePriceAndFee>}
 */
export async function getOrderPriceAndFees(
  asset: AssetExtended,
  accountId?: string
): Promise<OrderPriceAndFees> {
  const orderPriceAndFee = {
    price: '0',
    publisherMarketOrderFee: '0',
    publisherMarketPoolSwapFee: '0',
    publisherMarketFixedSwapFee: '0',
    consumeMarketOrderFee: '0',
    consumeMarketPoolSwapFee: '0',
    consumeMarketFixedSwapFee: '0',
    providerFee: {},
    opcFee: '0'
  } as OrderPriceAndFees
  const { accessDetails } = asset
  const { appConfig } = getSiteMetadata()

  // fetch publish market order fee
  orderPriceAndFee.publisherMarketOrderFee =
    asset.accessDetails.publisherMarketOrderFee
  // fetch consume market order fee
  orderPriceAndFee.consumeMarketOrderFee = appConfig.consumeMarketOrderFee
  // fetch provider fee
  const initializeData = await ProviderInstance.initialize(
    asset.id,
    asset.services[0].id,
    0,
    accountId,
    asset.services[0].serviceEndpoint
  )
  orderPriceAndFee.providerFee = initializeData.providerFee

  // fetch price and swap fees
  switch (accessDetails.type) {
    case 'dynamic': {
      const poolPrice = await calculateBuyPrice(accessDetails, asset.chainId)
      orderPriceAndFee.price = poolPrice
      break
    }
    case 'fixed': {
      const fixed = await getFixedBuyPrice(accessDetails, asset.chainId)
      orderPriceAndFee.price = fixed.baseTokenAmount
      break
    }
  }

  // calculate full price, we assume that all the values are in ocean, otherwise this will be incorrect
  orderPriceAndFee.price = new Decimal(orderPriceAndFee.price)
    .add(new Decimal(orderPriceAndFee.consumeMarketOrderFee))
    .add(new Decimal(orderPriceAndFee.publisherMarketOrderFee))
    .add(new Decimal(orderPriceAndFee.providerFee.providerFeeAmount))
    .toString()
  return orderPriceAndFee
}

/**
 * @param {number} chain
 * @param {string} datatokenAddress
 * @param {number=} timeout timout of the service, this is needed to return order details
 * @param {string=} account account that wants to buy, is needed to return order details
 * @param {bool=} includeOrderPriceAndFees if false price will be spot price (pool) and rate (fre), if true you will get the order price including fees !! fees not yet done
 * @returns {Promise<AccessDetails>}
 */
export async function getAccessDetails(
  chainId: number,
  datatokenAddress: string,
  timeout?: number,
  account = ''
): Promise<AccessDetails> {
  const queryContext = getQueryContext(Number(chainId))
  const tokenQueryResult: OperationResult<
    TokenPriceQuery,
    { datatokenId: string; account: string }
  > = await fetchData(
    TokenPriceQuery,
    {
      datatokenId: datatokenAddress.toLowerCase(),
      account: account?.toLowerCase()
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
      { datatokenIds: [string]; account: string }
    > = await fetchData(
      TokensPriceQuery,
      {
        datatokenIds: chainAssetLists[chainKey],
        account: account?.toLowerCase()
      },
      queryContext
    )
    tokenQueryResult.data?.tokens.forEach((token) => {
      const currentAsset = assetsExtended.find(
        (asset) => asset.services[0].datatokenAddress.toLowerCase() === token.id
      )
      const accessDetails = getAccessDetailsFromTokenPrice(
        token,
        currentAsset?.services[0]?.timeout
      )

      currentAsset.accessDetails = accessDetails
    })
  }
  return assetsExtended
}
