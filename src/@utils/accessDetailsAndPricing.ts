import {
  Datatoken,
  FixedRateExchange,
  getErrorMessage,
  LoggerInstance,
  ProviderFees,
  ProviderInstance,
  ZERO_ADDRESS
} from '@oceanprotocol/lib'
import { AssetPrice, Service } from '@oceanprotocol/ddo-js'
import { getFixedBuyPrice } from './ocean/fixedRateExchange'
import Decimal from 'decimal.js'
import {
  consumeMarketOrderFee,
  publisherMarketOrderFee,
  customProviderUrl
} from '../../app.config.cjs'
import { Signer, parseUnits } from 'ethers'
import { toast } from 'react-toastify'
import { getDummySigner } from './wallet'
// import { Service } from 'src/@types/ddo/Service'
import { CancelToken } from 'axios'
import { getUserOrders } from './aquarius'

/**
 * This will be used to get price including fees before ordering
 * @param {AssetExtended} asset
 * @return {Promise<OrdePriceAndFee>}
 */
export async function getOrderPriceAndFees( // this function give price
  asset: AssetExtended,
  service: Service,
  accessDetails: AccessDetails,
  accountId: string,
  signer?: Signer,
  providerFees?: ProviderFees
): Promise<OrderPriceAndFees> {
  const tokenDecimals = 18 // Replace with actual token decimals (fetch via contract if needed)

  const orderPriceAndFee = {
    price: accessDetails.price || '0',
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
  let initializeData
  try {
    const initialize = await ProviderInstance.initialize(
      asset.id,
      service.id,
      0,
      accountId,
      customProviderUrl || service.serviceEndpoint
    )
    initializeData = !providerFees && initialize
  } catch (error) {
    if (error.message.includes('Unexpected token')) {
      // toast.error(
      //   `Use the initializeCompute endpoint to initialize compute jobs`
      // )
      return
    }
    const message = getErrorMessage(error.message)
    LoggerInstance.error('[Initialize Provider] Error:', message)
    if (
      message.includes('ConsumableCodes.CREDENTIAL_NOT_IN_ALLOW_LIST') ||
      message.includes('denied with code: 3')
    ) {
      if (accountId !== ZERO_ADDRESS) {
        toast.error(
          `Consumer address not found in allow list for service ${asset.id}.`
        )
      }
      return orderPriceAndFee
    }
    if (
      message.includes('ConsumableCodes.CREDENTIAL_IN_DENY_LIST') ||
      message.includes('denied with code: 4')
    ) {
      if (accountId !== ZERO_ADDRESS) {
        toast.error(
          `Consumer address found in deny list for service ${asset.id}.`
        )
      }
      return orderPriceAndFee
    }
    toast.error(message)
  }
  orderPriceAndFee.providerFee = providerFees || initializeData?.providerFee

  // Fetch price and swap fees
  if (accessDetails.type === 'fixed') {
    const fixed = await getFixedBuyPrice(accessDetails, asset.chainId, signer)
    orderPriceAndFee.price = parseUnits(
      accessDetails.price,
      tokenDecimals
    ).toString()
    orderPriceAndFee.opcFee = parseUnits(
      fixed.oceanFeeAmount,
      tokenDecimals
    ).toString()
    orderPriceAndFee.publisherMarketFixedSwapFee = parseUnits(
      fixed.marketFeeAmount,
      tokenDecimals
    ).toString()
    orderPriceAndFee.consumeMarketFixedSwapFee = parseUnits(
      fixed.consumeMarketFeeAmount,
      tokenDecimals
    ).toString()
  } else {
    const price = new Decimal(+accessDetails.price || 0)
    const consumeMarketFeePercentage =
      Number(orderPriceAndFee?.consumeMarketOrderFee) || 0
    const publisherMarketFeePercentage =
      Number(orderPriceAndFee?.publisherMarketOrderFee) || 0

    if (
      isNaN(consumeMarketFeePercentage) ||
      isNaN(publisherMarketFeePercentage)
    ) {
      LoggerInstance.error('Invalid fee percentage')
      return orderPriceAndFee
    }

    const consumeMarketFee = price.mul(consumeMarketFeePercentage).div(100)
    const publisherMarketFee = price.mul(publisherMarketFeePercentage).div(100)
    const result = price.add(consumeMarketFee).add(publisherMarketFee)

    // Format result to respect token decimals
    orderPriceAndFee.price = parseUnits(
      result.toFixed(tokenDecimals),
      tokenDecimals
    ).toString()
  }

  LoggerInstance.log('OrderPriceAndFees:', orderPriceAndFee)
  return orderPriceAndFee
}

/**
 * @param {number} chainId
 * @param {Service} service service of which you want access details to
 * @returns {Promise<AccessDetails>}
 */
export async function getAccessDetails(
  chainId: number,
  service: Service,
  accountId: string,
  cancelToken: CancelToken
): Promise<AccessDetails> {
  const signer = await getDummySigner(chainId)

  const datatoken = new Datatoken(signer, chainId)
  const { datatokenAddress } = service

  const accessDetails: AccessDetails = {
    type: 'NOT_SUPPORTED',
    price: '0',
    addressOrId: '',
    baseToken: {
      address: '',
      name: '',
      symbol: '',
      decimals: 0
    },
    datatoken: {
      address: datatokenAddress,
      name: await datatoken.getName(datatokenAddress),
      symbol: await datatoken.getSymbol(datatokenAddress),
      decimals: 0
    },
    paymentCollector: await datatoken.getPaymentCollector(datatokenAddress),
    templateId: await datatoken.getId(datatokenAddress),
    // TODO these 4 records
    isOwned: false,
    validOrderTx: '', // should be possible to get from ocean-node - orders collection in typesense
    isPurchasable: true,
    publisherMarketOrderFee: '0'
  }
  try {
    // Check for past orders
    let allOrders: any[] = []
    let page = 1
    let totalPages = 1

    // Fetch all orders across all pages
    while (page <= totalPages) {
      const res = await getUserOrders(accountId, cancelToken, page)

      allOrders = allOrders.concat(res?.results || [])
      const orderTotal = res?.totalPages || 0
      totalPages = orderTotal
      page++
    }

    const order = allOrders.find(
      (order) =>
        order.datatokenAddress.toLowerCase() ===
          datatokenAddress.toLowerCase() ||
        order.payer.toLowerCase() === datatokenAddress.toLowerCase()
    )
    if (order) {
      const orderTimestamp = order.timestamp
      const timeout = Number(service.timeout)
      const now = Date.now()

      const isValid =
        timeout === 0 ||
        (orderTimestamp && orderTimestamp * 1000 + timeout * 1000 > now)
      accessDetails.isOwned = isValid
      accessDetails.validOrderTx = isValid ? order.orderId : ''
    }
  } catch (err) {
    LoggerInstance.error('[getAccessDetails] Failed to fetch user orders', err)
  }

  // if there is at least 1 dispenser => service is free and use first dispenser
  const dispensers = await datatoken.getDispensers(datatokenAddress)
  if (dispensers.length > 0) {
    return {
      ...accessDetails,
      type: 'free',
      addressOrId: dispensers[0],
      price: '0'
    }
  }

  // if there is 0 dispensers and at least 1 fixed rate => use first fixed rate to get the price details
  const fixedRates = await datatoken.getFixedRates(datatokenAddress)
  if (fixedRates.length > 0) {
    try {
      const freAddress = fixedRates[0].contractAddress
      const exchangeId = fixedRates[0].id
      const fre = new FixedRateExchange(freAddress, signer, chainId)
      const exchange = await fre.getExchange(exchangeId)
      return {
        ...accessDetails,
        type: 'fixed',
        addressOrId: exchangeId,
        price: exchange.fixedRate,
        baseToken: {
          address: exchange.baseToken,
          name: (await datatoken.getName(exchange.baseToken)) || '',
          symbol: (await datatoken.getSymbol(exchange.baseToken)) || '',
          decimals: parseInt(exchange.btDecimals)
        }
      }
    } catch (error) {
      console.log('error in getAccessDetails', error)
    }
  }

  return accessDetails
}

export function getAvailablePrice(accessDetails: AccessDetails): AssetPrice {
  const price: AssetPrice = {
    type: 'fixedrate',
    price: Number(accessDetails?.price).toString(),
    token: accessDetails?.baseToken?.symbol || '',
    contract: accessDetails?.baseToken?.address || ''
  }

  if (!accessDetails || accessDetails.price === undefined) {
    console.warn('Missing price in accessDetails:', accessDetails)
    return null
  }

  return price
}
