import {
  approve,
  Datatoken,
  FreOrderParams,
  LoggerInstance,
  OrderParams,
  ProviderInstance,
  ZERO_ADDRESS
} from '@oceanprotocol/lib'
import { AssetExtended } from 'src/@types/AssetExtended'
import Web3 from 'web3'
import { getOceanConfig } from './ocean'
import { TransactionReceipt } from 'web3-eth'

/**
 * For pool you need to buy the datatoken beforehand, this always assumes you want to order the first service
 * @param web3
 * @param asset
 * @param accountId
 * @returns {TokenReceipt} receipt of the order
 */
export async function order(
  web3: Web3,
  asset: AssetExtended,
  accountId: string
): Promise<TransactionReceipt> {
  const datatoken = new Datatoken(web3)
  console.log('asset order', asset)
  const config = getOceanConfig(asset.chainId)
  const txApprove = await approve(
    web3,
    accountId,
    config.oceanTokenAddress,
    accountId,
    '1',
    false
  )
  console.log('approve tx', txApprove)

  const initializeData = await ProviderInstance.initialize(
    asset.id,
    asset.services[0].id,
    0,
    accountId,
    asset.services[0].serviceEndpoint
  )

  const orderParams = {
    consumer: accountId,
    serviceIndex: 1,
    _providerFees: initializeData.providerFee
  } as OrderParams

  switch (asset.accessDetails?.type) {
    case 'fixed': {
      const freParams = {
        exchangeContract: config.fixedRateExchangeAddress,
        exchangeId: asset.accessDetails.addressOrId,
        maxBaseTokenAmount: web3.utils.toWei('2'),
        swapMarketFee: web3.utils.toWei('0'),
        marketFeeAddress: ZERO_ADDRESS
      } as FreOrderParams

      const tx = await datatoken.buyFromFreAndOrder(
        asset.services[0].datatokenAddress,
        accountId,
        orderParams,
        freParams
      )

      LoggerInstance.log('ordercreated', tx)
      return tx
    }
    case 'dynamic': {
      return null
    }

    case 'free': {
      const tx = await datatoken.buyFromDispenserAndOrder(
        asset.services[0].datatokenAddress,
        accountId,
        orderParams,
        config.dispenserAddress
      )

      LoggerInstance.log('ordercreated', tx)
      return tx
    }
  }
}
