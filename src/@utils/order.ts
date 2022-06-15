import {
  approve,
  Datatoken,
  FreOrderParams,
  LoggerInstance,
  OrderParams,
  ProviderComputeInitialize,
  ProviderFees,
  ProviderInstance,
  unitsToAmount
} from '@oceanprotocol/lib'
import { AssetExtended } from 'src/@types/AssetExtended'
import Web3 from 'web3'
import { getOceanConfig } from './ocean'
import { TransactionReceipt } from 'web3-eth'
import { OrderPriceAndFees } from 'src/@types/Price'
import {
  marketFeeAddress,
  consumeMarketOrderFee,
  consumeMarketFixedSwapFee
} from '../../app.config'
import { buyDtFromPool } from './pool'
import { toast } from 'react-toastify'

/**
 * For pool you need to buy the datatoken beforehand, this always assumes you want to order the first service
 * @param web3
 * @param asset
 * @param accountId
 * @param computeEnv
 * @param computeValidUntil
 * @param computeConsumerAddress
 * @returns {TransactionReceipt} receipt of the order
 */
export async function order(
  web3: Web3,
  asset: AssetExtended,
  orderPriceAndFees: OrderPriceAndFees,
  accountId: string,
  providerFees?: ProviderFees,
  computeConsumerAddress?: string
): Promise<TransactionReceipt> {
  const datatoken = new Datatoken(web3)
  const config = getOceanConfig(asset.chainId)

  const initializeData =
    !providerFees &&
    (await ProviderInstance.initialize(
      asset.id,
      asset.services[0].id,
      0,
      accountId,
      asset.services[0].serviceEndpoint
    ))

  const orderParams = {
    consumer: computeConsumerAddress || accountId,
    serviceIndex: 0,
    _providerFee: providerFees || initializeData.providerFee,
    _consumeMarketFee: {
      consumeMarketFeeAddress: marketFeeAddress,
      consumeMarketFeeAmount: consumeMarketOrderFee,
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
      if (!txApprove) {
        return
      }

      const freParams = {
        exchangeContract: config.fixedRateExchangeAddress,
        exchangeId: asset.accessDetails.addressOrId,
        maxBaseTokenAmount: orderPriceAndFees.price,
        swapMarketFee: consumeMarketFixedSwapFee,
        marketFeeAddress
      } as FreOrderParams
      console.log('freParams', freParams)
      console.log('orderParams', orderParams)
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
        computeConsumerAddress || accountId,
        0,
        providerFees || initializeData.providerFee
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

/**
 * called when having a valid order, but with expired provider access, requires approval of the provider fee
 * @param web3
 * @param asset
 * @param accountId
 * @param validOrderTx
 * @param providerFees
 * @returns {TransactionReceipt} receipt of the order
 */
export async function reuseOrder(
  web3: Web3,
  asset: AssetExtended,
  accountId: string,
  validOrderTx: string,
  providerFees?: ProviderFees
): Promise<TransactionReceipt> {
  const datatoken = new Datatoken(web3)
  const initializeData =
    !providerFees &&
    (await ProviderInstance.initialize(
      asset.id,
      asset.services[0].id,
      0,
      accountId,
      asset.services[0].serviceEndpoint
    ))

  if (
    providerFees?.providerFeeAmount ||
    initializeData?.providerFee?.providerFeeAmount
  ) {
    const txApprove = await approve(
      web3,
      accountId,
      providerFees.providerFeeToken ||
        initializeData.providerFee.providerFeeToken,
      asset.accessDetails.datatoken.address,
      await unitsToAmount(
        web3,
        providerFees.providerFeeToken ||
          initializeData.providerFee.providerFeeToken,
        providerFees.providerFeeAmount ||
          initializeData.providerFee.providerFeeAmount
      ),
      false
    )
    if (!txApprove) {
      return
    }
  }

  const tx = await datatoken.reuseOrder(
    asset.accessDetails.datatoken.address,
    accountId,
    validOrderTx,
    providerFees || initializeData.providerFee
  )

  return tx
}

/**
 * Handles order for compute assets for the following scenarios:
 * - have validOrder and no providerFees -> then order is valid, providerFees are valid, it returns the valid order value
 * - have validOrder and providerFees -> then order is valid but providerFees are not valid, we need to call reuseOrder and pay only providerFees
 * - no validOrder -> we need to call order, to pay 1 DT & providerFees
 * @param web3
 * @param asset
 * @param accountId
 * @param computeEnv
 * @param computeValidUntil
 * @param computeConsumerAddress
 * @returns {Promise<string>} tx id
 */
export async function handleComputeOrder(
  web3: Web3,
  asset: AssetExtended,
  orderPriceAndFees: OrderPriceAndFees,
  accountId: string,
  hasDatatoken: boolean,
  initializeData: ProviderComputeInitialize,
  computeConsumerAddress?: string
): Promise<string> {
  LoggerInstance.log(
    '[compute] Handle compute order for asset type: ',
    asset.metadata.type
  )
  if (initializeData.validOrder && !initializeData.providerFee) {
    LoggerInstance.log('[compute] Has valid order: ', initializeData.validOrder)
    return initializeData.validOrder
  } else if (initializeData.validOrder) {
    LoggerInstance.log('[compute] Calling reuseOrder ...', initializeData)
    const tx = await reuseOrder(
      web3,
      asset,
      accountId,
      initializeData.validOrder,
      initializeData.providerFee
    )
    LoggerInstance.log('[compute] Reused order:', tx.transactionHash)
    return tx.transactionHash
  } else {
    LoggerInstance.log('[compute] Calling order ...', initializeData)
    if (!hasDatatoken && asset?.accessDetails.type === 'dynamic') {
      const poolTx = await buyDtFromPool(asset?.accessDetails, accountId, web3)
      LoggerInstance.log('[compute] Buoght dt from pool: ', poolTx)
      if (!poolTx) {
        toast.error('Failed to buy datatoken from pool!')
        return
      }
    }
    const tx = await order(
      web3,
      asset,
      orderPriceAndFees,
      accountId,
      initializeData.providerFee,
      computeConsumerAddress
    )
    LoggerInstance.log('[compute] Asset ordered:', tx.transactionHash)
    return tx.transactionHash
  }
}
