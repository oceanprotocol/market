import { approve, Pool, ZERO_ADDRESS } from '@oceanprotocol/lib'
import Web3 from 'web3'
import { getSiteMetadata } from './siteConfig'
import { getDummyWeb3 } from './web3'
import { TransactionReceipt } from 'web3-eth'

/**
 * This is used to calculate the price to buy one datatoken from a pool, that is different from spot price. You need to pass either a web3 object or a chainId. If you pass a chainId a dummy web3 object will be created
 * @param {AccessDetails} accessDetails
 * @param {Web3?} [web3]
 * @param {number?} [chainId]
 * @return {Promise<PriceAndEstimation>}
 */
export async function calculateBuyPrice(
  accessDetails: AccessDetails,
  web3?: Web3,
  chainId?: number
): Promise<PriceAndEstimation> {
  if (web3 && chainId)
    throw new Error("web3 and chainId can't be undefined at the same time!")

  if (!web3) {
    web3 = await getDummyWeb3(chainId)
  }

  const pool = new Pool(web3)
  const { appConfig } = getSiteMetadata()
  const priceAndEstimation = {
    price: '0',
    gasEstimation: 0
  } as PriceAndEstimation

  const estimatedPrice = await pool.getAmountInExactOut(
    accessDetails.addressOrId,
    accessDetails.baseToken.address,
    accessDetails.datatoken.address,
    '1',
    appConfig.marketFee
  )
  priceAndEstimation.price = estimatedPrice

  const estimation = await pool.estSwapExactAmountOut(
    ZERO_ADDRESS,
    accessDetails.addressOrId,
    {
      marketFeeAddress: appConfig.marketFeeAddress,
      tokenIn: accessDetails.baseToken.address,
      tokenOut: accessDetails.datatoken.address
    },
    {
      maxAmountIn: (10 * accessDetails.price).toString(),
      swapMarketFee: appConfig.marketFee,
      tokenAmountOut: '1'
    }
  )
  priceAndEstimation.gasEstimation = estimation

  return priceAndEstimation
}

export async function buyDtFromPool(
  accessDetails: AccessDetails,
  accountId: string,
  web3: Web3
): Promise<TransactionReceipt> {
  const pool = new Pool(web3)
  const { appConfig } = getSiteMetadata()
  await approve(
    web3,
    accountId,
    accessDetails.baseToken.address,
    accessDetails.addressOrId,
    '200',
    false
  )

  const result = await pool.swapExactAmountOut(
    accountId,
    accessDetails.addressOrId,
    {
      marketFeeAddress: appConfig.marketFeeAddress,
      tokenIn: accessDetails.baseToken.address,
      tokenOut: accessDetails.datatoken.address
    },
    {
      maxAmountIn: (10 * accessDetails.price).toString(),
      swapMarketFee: appConfig.marketFee,
      tokenAmountOut: '1'
    }
  )

  return result
}
