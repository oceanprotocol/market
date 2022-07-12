import { approve, Pool, PoolPriceAndFees } from '@oceanprotocol/lib'
import Web3 from 'web3'
import { getDummyWeb3 } from './web3'
import { TransactionReceipt } from 'web3-eth'
import Decimal from 'decimal.js'
import { AccessDetails } from 'src/@types/Price'
import { consumeMarketPoolSwapFee, marketFeeAddress } from '../../app.config'

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

  const estimatedPrice = await pool.getAmountInExactOut(
    accessDetails.addressOrId,
    accessDetails.baseToken.address,
    accessDetails.datatoken.address,
    '1',
    consumeMarketPoolSwapFee,
    accessDetails.baseToken.decimals,
    accessDetails.datatoken.decimals
  )

  return estimatedPrice
}

export async function buyDtFromPool(
  accessDetails: AccessDetails,
  accountId: string,
  web3: Web3
): Promise<TransactionReceipt> {
  const pool = new Pool(web3)
  // we need to calculate the actual price to buy one datatoken
  const dtPrice = await calculateBuyPrice(accessDetails, null, web3)
  const approveTx = await approve(
    web3,
    accountId,
    accessDetails.baseToken.address,
    accessDetails.addressOrId,
    dtPrice.tokenAmount,
    false,
    accessDetails.baseToken.decimals
  )
  if (!approveTx) {
    return
  }
  const result = await pool.swapExactAmountOut(
    accountId,
    accessDetails.addressOrId,
    {
      marketFeeAddress,
      tokenIn: accessDetails.baseToken.address,
      tokenOut: accessDetails.datatoken.address,
      tokenInDecimals: accessDetails.baseToken.decimals,
      tokenOutDecimals: accessDetails.datatoken.decimals
    },
    {
      // this is just to be safe
      maxAmountIn: new Decimal(dtPrice.tokenAmount).mul(10).toString(),
      swapMarketFee: consumeMarketPoolSwapFee,
      tokenAmountOut: '1'
    }
  )

  return result
}

/**
 *  This is used to calculate the actual price of buying a datatoken, it's a copy of the math in the contracts.
 * @param params
 * @returns
 */
export function calcInGivenOut(params: CalcInGivenOutParams): PoolPriceAndFees {
  const result = {
    tokenAmount: '0',
    liquidityProviderSwapFeeAmount: '0',
    oceanFeeAmount: '0',
    publishMarketSwapFeeAmount: '0',
    consumeMarketSwapFeeAmount: '0'
  } as PoolPriceAndFees
  const one = new Decimal(1)
  const tokenOutLiqudity = new Decimal(params.tokenOutLiquidity)
  const tokenInLiquidity = new Decimal(params.tokenInLiquidity)
  const tokenOutAmount = new Decimal(params.tokenOutAmount)
  const opcFee = new Decimal(params.opcFee)
  const lpFee = new Decimal(params.lpSwapFee)
  const publishMarketSwapFee = new Decimal(params.publishMarketSwapFee)
  const consumeMarketSwapFee = new Decimal(params.consumeMarketSwapFee)

  const diff = tokenOutLiqudity.minus(tokenOutAmount)
  const y = tokenOutLiqudity.div(diff)
  let foo = y.pow(one)
  foo = foo.minus(one)
  const totalFee = lpFee
    .plus(opcFee)
    .plus(publishMarketSwapFee)
    .plus(consumeMarketSwapFee)

  const tokenAmountIn = tokenInLiquidity.mul(foo).div(one.sub(totalFee))
  result.tokenAmount = tokenAmountIn.toString()
  result.oceanFeeAmount = tokenAmountIn
    .sub(tokenAmountIn.mul(one.sub(opcFee)))
    .toString()
  result.publishMarketSwapFeeAmount = tokenAmountIn
    .sub(tokenAmountIn.mul(one.sub(publishMarketSwapFee)))
    .toString()
  result.consumeMarketSwapFeeAmount = tokenAmountIn
    .sub(tokenAmountIn.mul(one.sub(consumeMarketSwapFee)))
    .toString()
  result.liquidityProviderSwapFeeAmount = tokenAmountIn
    .sub(tokenAmountIn.mul(one.sub(lpFee)))
    .toString()

  return result
}

/**
 * Used to calculate swap values, it's a copy of the math in the contracts.
 * @param tokenLiquidity
 * @param poolSupply
 * @param poolShareAmount
 * @returns
 */
export function calcSingleOutGivenPoolIn(
  tokenLiquidity: string,
  poolSupply: string,
  poolShareAmount: string
): string {
  const tokenLiquidityD = new Decimal(tokenLiquidity)
  const poolSupplyD = new Decimal(poolSupply)
  const poolShareAmountD = new Decimal(poolShareAmount).mul(2)
  const newPoolSupply = poolSupplyD.sub(poolShareAmountD)
  const poolRatio = newPoolSupply.div(poolSupplyD)

  const tokenOutRatio = new Decimal(1).sub(poolRatio)
  const newTokenBalanceOut = tokenLiquidityD.mul(tokenOutRatio)
  return newTokenBalanceOut.toString()
}

/**
 * Returns the amount of tokens (based on tokenAddress) that can be withdrawn from the pool
 * @param {string} poolAddress
 * @param {string} tokenAddress
 * @param {string} shares
 * @param {number} chainId
 * @returns
 */
export async function getLiquidityByShares(
  pool: string,
  tokenAddress: string,
  tokenDecimals: number,
  shares: string,
  chainId: number
): Promise<string> {
  // we only use the dummyWeb3 connection here
  const web3 = await getDummyWeb3(chainId)

  const poolInstance = new Pool(web3)
  // get shares VL in ocean
  const amountBaseToken = await poolInstance.calcSingleOutGivenPoolIn(
    pool,
    tokenAddress,
    shares,
    18,
    tokenDecimals
  )

  return amountBaseToken
}
