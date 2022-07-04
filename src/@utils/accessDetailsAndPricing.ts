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
import {
  Asset,
  LoggerInstance,
  ProviderFees,
  ProviderInstance
} from '@oceanprotocol/lib'
import { AssetExtended } from 'src/@types/AssetExtended'
import { calcInGivenOut } from './pool'
import { getFixedBuyPrice } from './fixedRateExchange'
import { AccessDetails, OrderPriceAndFees } from 'src/@types/Price'
import Decimal from 'decimal.js'
import { consumeMarketOrderFee } from '../../app.config'
import Web3 from 'web3'

const tokensPriceQuery = gql`
  query TokensPriceQuery($datatokenIds: [ID!], $account: String) {
    tokens(where: { id_in: $datatokenIds }) {
      id
      symbol
      name
      publishMarketFeeAddress
      publishMarketFeeToken
      publishMarketFeeAmount
      orders(
        where: { payer: $account }
        orderBy: createdTimestamp
        orderDirection: desc
      ) {
        tx
        serviceIndex
        createdTimestamp
        reuses(orderBy: createdTimestamp, orderDirection: desc) {
          id
          caller
          createdTimestamp
          tx
          block
        }
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
        exchangeId
        price
        publishMarketSwapFee
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
const tokenPriceQuery = gql`
  query TokenPriceQuery($datatokenId: ID!, $account: String) {
    token(id: $datatokenId) {
      id
      symbol
      name
      publishMarketFeeAddress
      publishMarketFeeToken
      publishMarketFeeAmount
      orders(
        where: { payer: $account }
        orderBy: createdTimestamp
        orderDirection: desc
      ) {
        tx
        serviceIndex
        createdTimestamp
        reuses(orderBy: createdTimestamp, orderDirection: desc) {
          id
          caller
          createdTimestamp
          tx
          block
        }
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
        exchangeId
        price
        publishMarketSwapFee
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

  if (tokenPrice?.orders?.length > 0) {
    const order = tokenPrice.orders[0]
    const reusedOrder = order?.reuses?.length > 0 ? order.reuses[0] : null
    // asset is owned if there is an order and asset has timeout 0 (forever) or if the condition is valid
    accessDetails.isOwned =
      timeout === 0 || Date.now() / 1000 - order?.createdTimestamp < timeout
    // the last valid order should be the last reuse order tx id if there is one
    accessDetails.validOrderTx = reusedOrder?.tx || order?.tx
  }

  // TODO: fetch order fee from sub query
  accessDetails.publisherMarketOrderFee = tokenPrice?.publishMarketFeeAmount

  // free is always the best price
  if (tokenPrice?.dispensers?.length > 0) {
    const dispenser = tokenPrice.dispensers[0]
    accessDetails.type = 'free'
    accessDetails.addressOrId = dispenser.token.id
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
  if (tokenPrice?.fixedRateExchanges?.length > 0) {
    const fixed = tokenPrice.fixedRateExchanges[0]
    accessDetails.type = 'fixed'
    accessDetails.addressOrId = fixed.exchangeId
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
  if (tokenPrice?.pools?.length > 0) {
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
 * This will be used to get price including fees before ordering
 * @param {AssetExtended} asset
 * @return {Promise<OrdePriceAndFee>}
 */
export async function getOrderPriceAndFees(
  asset: AssetExtended,
  accountId?: string,
  paramsForPool?: CalcInGivenOutParams,
  providerFees?: ProviderFees
): Promise<OrderPriceAndFees> {
  const orderPriceAndFee = {
    price: '0',
    publisherMarketOrderFee:
      asset?.accessDetails?.publisherMarketOrderFee || '0',
    publisherMarketPoolSwapFee: '0',
    publisherMarketFixedSwapFee: '0',
    consumeMarketOrderFee: consumeMarketOrderFee || '0',
    consumeMarketPoolSwapFee: '0',
    consumeMarketFixedSwapFee: '0',
    providerFee: {
      providerFeeAmount: '0'
    },
    opcFee: '0'
  } as OrderPriceAndFees

  // fetch provider fee

  const initializeData =
    !providerFees &&
    (await ProviderInstance.initialize(
      asset?.id,
      asset?.services[0].id,
      0,
      accountId,
      asset?.services[0].serviceEndpoint
    ))
  orderPriceAndFee.providerFee = providerFees || initializeData.providerFee

  // fetch price and swap fees
  switch (asset?.accessDetails?.type) {
    case 'dynamic': {
      const poolPrice = calcInGivenOut(paramsForPool)
      orderPriceAndFee.price = poolPrice.tokenAmount
      orderPriceAndFee.liquidityProviderSwapFee =
        poolPrice.liquidityProviderSwapFeeAmount
      orderPriceAndFee.publisherMarketPoolSwapFee =
        poolPrice.publishMarketSwapFeeAmount
      orderPriceAndFee.consumeMarketPoolSwapFee =
        poolPrice.consumeMarketSwapFeeAmount
      break
    }
    case 'fixed': {
      const fixed = await getFixedBuyPrice(asset?.accessDetails, asset?.chainId)
      orderPriceAndFee.price = fixed.baseTokenAmount
      orderPriceAndFee.opcFee = fixed.oceanFeeAmount
      orderPriceAndFee.publisherMarketFixedSwapFee = fixed.marketFeeAmount
      orderPriceAndFee.consumeMarketFixedSwapFee = fixed.consumeMarketFeeAmount

      break
    }
  }

  // calculate full price, we assume that all the values are in ocean, otherwise this will be incorrect
  orderPriceAndFee.price = new Decimal(+orderPriceAndFee.price || 0)
    .add(new Decimal(+orderPriceAndFee?.consumeMarketOrderFee || 0))
    .add(new Decimal(+orderPriceAndFee?.publisherMarketOrderFee || 0))
    .toString()
  return orderPriceAndFee
}

/**
 * @param {number} chainId
 * @param {string} datatokenAddress
 * @param {number} timeout timout of the service, this is needed to return order details
 * @param {string} account account that wants to buy, is needed to return order details
 * @returns {Promise<AccessDetails>}
 */
export async function getAccessDetails(
  chainId: number,
  datatokenAddress: string,
  timeout?: number,
  account = ''
): Promise<AccessDetails> {
  try {
    const queryContext = getQueryContext(Number(chainId))
    const tokenQueryResult: OperationResult<
      TokenPriceQuery,
      { datatokenId: string; account: string }
    > = await fetchData(
      tokenPriceQuery,
      {
        datatokenId: datatokenAddress.toLowerCase(),
        account: account?.toLowerCase()
      },
      queryContext
    )

    const tokenPrice: TokenPrice = tokenQueryResult.data.token
    const accessDetails = getAccessDetailsFromTokenPrice(tokenPrice, timeout)
    return accessDetails
  } catch (error) {
    LoggerInstance.error('Error getting access details: ', error.message)
  }
}

export async function getAccessDetailsForAssets(
  assets: Asset[],
  account = ''
): Promise<AssetExtended[]> {
  const assetsExtended: AssetExtended[] = assets
  const chainAssetLists: { [key: number]: string[] } = {}

  try {
    for (const asset of assets) {
      if (chainAssetLists[asset.chainId]) {
        chainAssetLists[asset.chainId].push(
          asset.services[0].datatokenAddress.toLowerCase()
        )
      } else {
        chainAssetLists[asset.chainId] = []
        chainAssetLists[asset.chainId].push(
          asset.services[0].datatokenAddress.toLowerCase()
        )
      }
    }

    for (const chainKey in chainAssetLists) {
      const queryContext = getQueryContext(Number(chainKey))
      const tokenQueryResult: OperationResult<
        TokensPriceQuery,
        { datatokenIds: [string]; account: string }
      > = await fetchData(
        tokensPriceQuery,
        {
          datatokenIds: chainAssetLists[chainKey],
          account: account?.toLowerCase()
        },
        queryContext
      )
      tokenQueryResult.data?.tokens.forEach((token) => {
        const currentAsset = assetsExtended.find(
          (asset) =>
            asset.services[0].datatokenAddress.toLowerCase() === token.id
        )
        const accessDetails = getAccessDetailsFromTokenPrice(
          token,
          currentAsset?.services[0]?.timeout
        )

        currentAsset.accessDetails = accessDetails
      })
    }
    return assetsExtended
  } catch (error) {
    LoggerInstance.error('Error getting access details: ', error.message)
  }
}
