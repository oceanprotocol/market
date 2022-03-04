import { approve, Pool, PoolPriceAndFees } from '@oceanprotocol/lib'
import Web3 from 'web3'
import { getSiteMetadata } from './siteConfig'
import { getDummyWeb3 } from './web3'
import { TransactionReceipt } from 'web3-eth'
import Decimal from 'decimal.js'
import { AccessDetails } from 'src/@types/Price'
import { isValidNumber } from './numbers'
import { MAX_DECIMALS } from './constants'
/**
 * This is used to calculate the price to buy one datatoken from a pool, that is different from spot price. You need to pass either a web3 object or a chainId. If you pass a chainId a dummy web3 object will be created
 * @param {AccessDetails} accessDetails
 * @param {Web3?} [web3]
 * @param {number?} [chainId]
 * @return {Promise<PoolPriceAndFees>}
 */
export async function calculateBuyPrice(
  accessDetails: AccessDetails,
  chainId?: number,
  web3?: Web3
): Promise<PoolPriceAndFees> {
  if (!web3 && !chainId)
    throw new Error("web3 and chainId can't be undefined at the same time!")

  if (!web3) {
    web3 = await getDummyWeb3(chainId)
  }

  const pool = new Pool(web3)
  const { appConfig } = getSiteMetadata()
  const estimatedPrice = await pool.getAmountInExactOut(
    accessDetails.addressOrId,
    accessDetails.baseToken.address,
    accessDetails.datatoken.address,
    '1',
    appConfig.consumeMarketPoolSwapFee
  )

  return estimatedPrice
}

export async function buyDtFromPool(
  accessDetails: AccessDetails,
  accountId: string,
  web3: Web3
): Promise<TransactionReceipt> {
  const pool = new Pool(web3)
  const { appConfig } = getSiteMetadata()
  // we need to calculate the actual price to buy one datatoken
  const dtPrice = await calculateBuyPrice(accessDetails, null, web3)
  const approveTx = await approve(
    web3,
    accountId,
    accessDetails.baseToken.address,
    accessDetails.addressOrId,
    dtPrice.tokenAmount,
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
      // this is just to be safe
      maxAmountIn: new Decimal(dtPrice.tokenAmount).mul(10).toString(),
      swapMarketFee: appConfig.consumeMarketPoolSwapFee,
      tokenAmountOut: '1'
    }
  )

  return result
}

/**
 * Calculate the base token liquidity based on shares info
 * @param {string} shares
 * @param {string} totalShares
 * @param {string} baseTokenLiquidity
 * @returns
 */
export function calculateUserLiquidity(
  shares: string,
  totalShares: string,
  baseTokenLiquidity: string
): string {
  const totalLiquidity =
    isValidNumber(shares) &&
    isValidNumber(totalShares) &&
    isValidNumber(baseTokenLiquidity)
      ? new Decimal(shares)
          .dividedBy(new Decimal(totalShares))
          .mul(baseTokenLiquidity)
      : new Decimal(0)
  return totalLiquidity.toDecimalPlaces(MAX_DECIMALS).toString()
}

export function calculateUserTVL(
  shares: string,
  totalShares: string,
  baseTokenLiquidity: string
): string {
  const liquidity = calculateUserLiquidity(
    shares,
    totalShares,
    baseTokenLiquidity
  )
  const tvl = new Decimal(liquidity).mul(2) // we multiply by 2 because of ss bot
  return tvl.toDecimalPlaces(MAX_DECIMALS).toString()
}
