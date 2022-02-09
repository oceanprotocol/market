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
import Decimal from 'decimal.js'

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
  accountId: string
): Promise<TransactionReceipt> {
  const datatoken = new Datatoken(web3)
  const config = getOceanConfig(asset.chainId)
  const { appConfig } = getSiteMetadata()

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
    _providerFees: initializeData.providerFee
  } as OrderParams

  switch (asset.accessDetails?.type) {
    case 'fixed': {
      // this approve implies that basetToken is the same as swap fee token
      const totalCost = new Decimal(asset.accessDetails.price).add(
        new Decimal(appConfig.marketFee)
      )

      const txApprove = await approve(
        web3,
        accountId,
        asset.accessDetails.baseToken.address,
        asset.accessDetails.datatoken.address,
        totalCost.toString(),
        false
      )

      const freParams = {
        exchangeContract: config.fixedRateExchangeAddress,
        exchangeId: asset.accessDetails.addressOrId,
        maxBaseTokenAmount: web3.utils.toWei('1'),
        swapMarketFee: web3.utils.toWei(appConfig.marketFee),
        marketFeeAddress: appConfig.marketFeeAddress
      } as FreOrderParams

      const tx = await datatoken.buyFromFreAndOrder(
        asset.services[0].datatokenAddress,
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
        1,
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
