import {
  approve,
  Config,
  Datatoken,
  FreOrderParams,
  OrderParams,
  ProviderInstance
} from '@oceanprotocol/lib'
import { AssetExtended } from 'src/@types/AssetExtended'
import Web3 from 'web3'
import { getDummyWeb3 } from './web3'
import { getOceanConfig } from './ocean'
import { TransactionReceipt } from 'web3-eth'
import { getSiteMetadata } from './siteConfig'
import { OrderPriceAndFees } from 'src/@types/Price'

/**
 * Before stating the transactions, we need to initialized our provider's instance
 * @param asset
 * @param accountId
 * @param appConfig
 * @param config
 * @returns { initializeData, orderParams } provider instance's information + orderParams
 */
async function initProvider(
  asset: AssetExtended,
  accountId: string,
  appConfig: any,
  config: Config
) {
  const initializeData = await ProviderInstance.initialize(
    asset.id,
    asset.services[0].id,
    0,
    accountId,
    asset.services[0].serviceEndpoint
  )

  const orderParams = {
    consumer: accountId,
    serviceIndex: 0,
    _providerFee: initializeData.providerFee,
    _consumeMarketFee: {
      consumeMarketFeeAddress: appConfig.marketFeeAddress,
      consumeMarketFeeAmount: appConfig.consumeMarketOrderFee,
      consumeMarketFeeToken: config.oceanTokenAddress
    }
  } as OrderParams

  return {
    initializeData,
    orderParams
  }
}

/**
 * Before stating the transactions, we need to initialized our provider's instance
 * @param web3
 * @param asset
 * @param accountId
 * @param appConfig
 * @param config
 * @param action
 * @param orderPriceAndFees
 * @returns {TransactionReceipt} receipt of the order / gas estimate
 */
async function getTransaction(
  web3: Web3,
  asset: AssetExtended,
  accountId: string,
  appConfig: any,
  config: Config,
  action: string,
  orderPriceAndFees?: OrderPriceAndFees
) {
  const datatoken = new Datatoken(web3)
  const { initializeData, orderParams } = await initProvider(
    asset,
    accountId,
    appConfig,
    config
  )

  let tx
  switch (asset.accessDetails?.type) {
    case 'fixed': {
      const freParams = {
        exchangeContract: config.fixedRateExchangeAddress,
        exchangeId: asset.accessDetails.addressOrId,
        maxBaseTokenAmount:
          action === 'gasfees'
            ? asset.accessDetails?.price
            : orderPriceAndFees.price,
        swapMarketFee: appConfig.consumeMarketFixedSwapFee,
        marketFeeAddress: appConfig.marketFeeAddress
      } as FreOrderParams

      if (action === 'gasfees') {
        tx = await datatoken.estGasBuyFromFreAndOrder(
          asset.accessDetails.datatoken.address,
          accountId,
          orderParams,
          freParams
        )
      } else {
        // this assumes all fees are in ocean
        const txApprove = await approve(
          web3,
          accountId,
          asset.accessDetails.baseToken.address,
          asset.accessDetails.datatoken.address,
          orderPriceAndFees.price,
          false
        )
        if (!txApprove) {
          throw new Error()
        }

        tx = await datatoken.buyFromFreAndOrder(
          asset.accessDetails.datatoken.address,
          accountId,
          orderParams,
          freParams
        )
      }
      return tx
    }
    case 'dynamic': {
      action === 'gasfees'
        ? (tx = await datatoken.estGasStartOrder(
            asset.accessDetails.datatoken.address,
            accountId,
            accountId,
            0,
            initializeData.providerFee
          ))
        : (tx = await datatoken.startOrder(
            asset.accessDetails.datatoken.address,
            accountId,
            accountId,
            0,
            initializeData.providerFee
          ))

      return tx
    }

    case 'free': {
      action === 'gasfees'
        ? (tx = await datatoken.estGasBuyFromDispenserAndOrder(
            asset.services[0].datatokenAddress,
            accountId,
            orderParams,
            config.dispenserAddress
          ))
        : (tx = await datatoken.buyFromDispenserAndOrder(
            asset.services[0].datatokenAddress,
            accountId,
            orderParams,
            config.dispenserAddress
          ))
      return tx
    }
  }
}

/**
 * For pool you need to buy the datatoken beforehand, this always assumes you want to order the first service
 * @param web3
 * @param asset
 * @param accountId
 * @returns {TransactionReceipt} receipt of the order
 */
export async function order(
  web3: Web3,
  asset: AssetExtended,
  orderPriceAndFees: OrderPriceAndFees,
  accountId: string
): Promise<TransactionReceipt> {
  const config = getOceanConfig(asset.chainId)
  const { appConfig } = getSiteMetadata()

  return getTransaction(
    web3,
    asset,
    accountId,
    appConfig,
    config,
    'order',
    orderPriceAndFees
  )
}

/**
 * Calculate gas estimates for order asset
 * @param asset
 * @param accountId
 * @param web3
 * @returns {TransactionReceipt} receipt of the order
 */
export async function orderGasEstimates(
  asset: AssetExtended,
  accountId: string,
  web3?: Web3
): Promise<TransactionReceipt> {
  if (!web3) {
    web3 = await getDummyWeb3(asset.chainId)
  }

  const config = getOceanConfig(asset.chainId)
  const { appConfig } = getSiteMetadata()

  return getTransaction(web3, asset, accountId, appConfig, config, 'gasfees')
}
