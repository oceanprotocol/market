import {
  approve,
  Datatoken,
  FreOrderParams,
  OrderParams,
  ProviderInstance
} from '@oceanprotocol/lib'
import { AssetExtended } from 'src/@types/AssetExtended'
import Web3 from 'web3'
import { getOceanConfig } from './ocean'
import { TransactionReceipt } from 'web3-eth'
import { getSiteMetadata } from './siteConfig'
import { OrderPriceAndFees } from 'src/@types/Price'

function getValidUntilTime() {
  const mytime = new Date()
  mytime.setMinutes(mytime.getMinutes() + 19)
  return Math.floor(mytime.getTime() / 1000)
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
  const datatoken = new Datatoken(web3)
  const config = getOceanConfig(asset.chainId)
  const { appConfig } = getSiteMetadata()

  const computeEnvs =
    asset.services[0].type === 'compute'
      ? await ProviderInstance.getComputeEnvironments(
          asset.services[0].serviceEndpoint
        )
      : null
  const computeEnviroment =
    computeEnvs && computeEnvs[0] ? computeEnvs[0].id : null
  const computeValidUntil =
    asset.services[0].type === 'compute' ? getValidUntilTime() : null

  const initializeData = await ProviderInstance.initialize(
    asset.id,
    asset.services[0].id,
    0,
    accountId,
    asset.services[0].serviceEndpoint,
    null,
    null,
    computeEnviroment,
    computeValidUntil
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

  // TODO: we need to approve provider fee
  switch (asset.accessDetails?.type) {
    case 'fixed': {
      // this assumes all fees are in ocean
      const txApprove = await approve(
        web3,
        accountId,
        asset.accessDetails.baseToken.address,
        asset.accessDetails.datatoken.address,
        orderPriceAndFees.price,
        false
      )

      const freParams = {
        exchangeContract: config.fixedRateExchangeAddress,
        exchangeId: asset.accessDetails.addressOrId,
        maxBaseTokenAmount: orderPriceAndFees.price,
        swapMarketFee: appConfig.consumeMarketFixedSwapFee,
        marketFeeAddress: appConfig.marketFeeAddress
      } as FreOrderParams
      const tx = await datatoken.buyFromFreAndOrder(
        asset.accessDetails.datatoken.address,
        accountId,
        orderParams,
        freParams
      )

      return tx
    }
    case 'dynamic': {
      const tx = await datatoken.startOrder(
        asset.accessDetails.datatoken.address,
        accountId,
        accountId,
        0,
        initializeData.providerFee
      )
      return tx
    }

    case 'free': {
      const tx = await datatoken.buyFromDispenserAndOrder(
        asset.services[0].datatokenAddress,
        accountId,
        orderParams,
        config.dispenserAddress
      )
      return tx
    }
  }
}
