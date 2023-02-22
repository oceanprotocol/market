import { gql, OperationResult } from 'urql'
import { fetchData, getQueryContext } from './subgraph'
import {
  TokenPriceQuery,
  TokenPriceQuery_token as TokenPrice
} from '../@types/subgraph/TokenPriceQuery'
import {
  LoggerInstance,
  ProviderFees,
  ProviderInstance
} from '@oceanprotocol/lib'
import { getFixedBuyPrice } from './fixedRateExchange'
import Decimal from 'decimal.js'
import {
  consumeMarketOrderFee,
  publisherMarketOrderFee
} from '../../app.config'

const tokenPriceQuery = gql`
  query TokenPriceQuery($datatokenId: ID!, $account: String) {
    token(id: $datatokenId) {
      id
      symbol
      name
      templateId
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
        providerFee
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
          decimals
        }
        datatoken {
          symbol
          name
          address
        }
        active
      }
    }
  }
`

function getAccessDetailsFromTokenPrice(
  tokenPrice: TokenPrice,
  timeout?: number
): AccessDetails {
  const accessDetails = {} as AccessDetails

  // Return early when no supported pricing schema found.
  if (
    tokenPrice?.dispensers?.length === 0 &&
    tokenPrice?.fixedRateExchanges?.length === 0
  ) {
    accessDetails.type = 'NOT_SUPPORTED'
    return accessDetails
  }

  if (tokenPrice?.orders?.length > 0) {
    const order = tokenPrice.orders[0]
    const providerFees: ProviderFees = order?.providerFee
      ? JSON.parse(order.providerFee)
      : null
    accessDetails.validProviderFees =
      providerFees?.validUntil &&
      Date.now() / 1000 < Number(providerFees?.validUntil)
        ? providerFees
        : null
    const reusedOrder = order?.reuses?.length > 0 ? order.reuses[0] : null
    // asset is owned if there is an order and asset has timeout 0 (forever) or if the condition is valid
    accessDetails.isOwned =
      timeout === 0 || Date.now() / 1000 - order?.createdTimestamp < timeout
    // the last valid order should be the last reuse order tx id if there is one
    accessDetails.validOrderTx = reusedOrder?.tx || order?.tx
  }
  accessDetails.templateId = tokenPrice.templateId
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
      symbol: fixed.baseToken.symbol,
      decimals: fixed.baseToken.decimals
    }
    accessDetails.datatoken = {
      address: fixed.datatoken.address,
      name: fixed.datatoken.name,
      symbol: fixed.datatoken.symbol
    }
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
  providerFees?: ProviderFees
): Promise<OrderPriceAndFees> {
  const orderPriceAndFee = {
    price: String(asset?.stats?.price?.value || '0'),
    publisherMarketOrderFee: publisherMarketOrderFee || '0',
    publisherMarketFixedSwapFee: '0',
    consumeMarketOrderFee: consumeMarketOrderFee || '0',
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
  if (asset?.accessDetails?.type === 'fixed') {
    const fixed = await getFixedBuyPrice(asset?.accessDetails, asset?.chainId)
    orderPriceAndFee.price = fixed.baseTokenAmount
    orderPriceAndFee.opcFee = fixed.oceanFeeAmount
    orderPriceAndFee.publisherMarketFixedSwapFee = fixed.marketFeeAmount
    orderPriceAndFee.consumeMarketFixedSwapFee = fixed.consumeMarketFeeAmount
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
