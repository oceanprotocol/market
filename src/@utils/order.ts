import {
  amountToUnits,
  approve,
  approveWei,
  Datatoken,
  FreOrderParams,
  LoggerInstance,
  OrderParams,
  ProviderComputeInitialize,
  ProviderFees,
  ProviderInstance
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
 * @param orderPriceAndFees
 * @param accountId
 * @param providerFees
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

  switch (asset.accessDetails?.type) {
    case 'fixed': {
      // this assumes all fees are in ocean
      const txApprove = await approve(
        web3,
        accountId,
        asset.accessDetails.baseToken.address,
        asset.accessDetails.datatoken.address,
        await amountToUnits(
          web3,
          asset?.accessDetails?.baseToken?.address,
          orderPriceAndFees.price
        ),
        false
      )
      if (!txApprove) {
        return
      }

      const freParams = {
        exchangeContract: config.fixedRateExchangeAddress,
        exchangeId: asset.accessDetails.addressOrId,
        maxBaseTokenAmount: orderPriceAndFees.price,
        baseTokenAddress: asset?.accessDetails?.baseToken?.address,
        baseTokenDecimals: asset?.accessDetails?.baseToken?.decimals || 18,
        swapMarketFee: consumeMarketFixedSwapFee,
        marketFeeAddress
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

  const tx = await datatoken.reuseOrder(
    asset.accessDetails.datatoken.address,
    accountId,
    validOrderTx,
    providerFees || initializeData.providerFee
  )

  return tx
}

async function approveProviderFee(
  asset: AssetExtended,
  accountId: string,
  web3: Web3,
  providerFeeAmount: string
): Promise<string> {
  const baseToken =
    asset?.accessDetails?.type === 'free'
      ? getOceanConfig(asset.chainId).oceanTokenAddress
      : asset?.accessDetails?.baseToken?.address
  const txApproveWei = await approveWei(
    web3,
    accountId,
    baseToken,
    asset?.accessDetails?.datatoken?.address,
    providerFeeAmount
  )
  return txApproveWei as string // thanks ocean.js
}

async function startOrder(
  web3: Web3,
  asset: AssetExtended,
  orderPriceAndFees: OrderPriceAndFees,
  accountId: string,
  hasDatatoken: boolean,
  initializeData: ProviderComputeInitialize,
  computeConsumerAddress?: string
): Promise<TransactionReceipt> {
  if (!hasDatatoken && asset?.accessDetails.type === 'dynamic') {
    const poolTx = await buyDtFromPool(asset?.accessDetails, accountId, web3)
    LoggerInstance.log('[compute] Bought datatoken from pool: ', poolTx)
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
  LoggerInstance.log('[compute] Asset ordered:', tx)
  return tx
}

/**
 * Handles order for compute assets for the following scenarios:
 * - have validOrder and no providerFees -> then order is valid, providerFees are valid, it returns the valid order value
 * - have validOrder and providerFees -> then order is valid but providerFees are not valid, we need to call reuseOrder and pay only providerFees
 * - no validOrder -> we need to call order, to pay 1 DT & providerFees
 * @param web3
 * @param asset
 * @param orderPriceAndFees
 * @param accountId
 * @param hasDatatoken
 * @param initializeData
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
  LoggerInstance.log('[compute] Using initializeData: ', initializeData)

  try {
    // Return early when valid order is found, and no provider fees
    // are to be paid
    if (initializeData?.validOrder && !initializeData.providerFee) {
      LoggerInstance.log(
        '[compute] Has valid order: ',
        initializeData.validOrder
      )
      return asset?.accessDetails?.validOrderTx
    }

    // Approve potential Provider fee amount first
    if (initializeData?.providerFee?.providerFeeAmount !== '0') {
      const txApproveProvider = await approveProviderFee(
        asset,
        accountId,
        web3,
        initializeData.providerFee.providerFeeAmount
      )

      if (!txApproveProvider)
        throw new Error('Failed to approve provider fees!')

      LoggerInstance.log('[compute] Approved provider fees:', txApproveProvider)
    }

    if (initializeData?.validOrder) {
      LoggerInstance.log('[compute] Calling reuseOrder ...', initializeData)
      const txReuseOrder = await reuseOrder(
        web3,
        asset,
        accountId,
        initializeData.validOrder,
        initializeData.providerFee
      )
      if (!txReuseOrder) throw new Error('Failed to reuse order!')
      LoggerInstance.log('[compute] Reused order:', txReuseOrder)
      return txReuseOrder?.transactionHash
    }

    LoggerInstance.log('[compute] Calling order ...', initializeData)
    const txStartOrder = await startOrder(
      web3,
      asset,
      orderPriceAndFees,
      accountId,
      hasDatatoken,
      initializeData,
      computeConsumerAddress
    )
    LoggerInstance.log('[compute] Order succeeded', txStartOrder)
    return txStartOrder?.transactionHash
  } catch (error) {
    toast.error(error.message)
    LoggerInstance.error(`[compute] ${error.message}`)
  }
}
