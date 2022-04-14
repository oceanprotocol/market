import { approve, FeesInfo, Pool, PoolPriceAndFees } from '@oceanprotocol/lib'
import Web3 from 'web3'
import { getSiteMetadata } from './siteConfig'
import { getDummyWeb3 } from './web3'
import { TransactionReceipt } from 'web3-eth'
import Decimal from 'decimal.js'
import { AccessDetails } from 'src/@types/Price'
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
  if (!approveTx) {
    return
  }
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

// _records[tokenIn].balance,
// _records[tokenIn].denorm,
// _records[tokenOut].balance,
// _records[tokenOut].denorm

export function calcInGivenOut(params: CalcInGivenOutParams): PoolPriceAndFees {
  const result = {
    tokenAmount: '0',
    liquidityProviderSwapFeeAmount: '0',
    oceanFeeAmount: '0',
    publishMarketSwapFeeAmount: '0',
    consumeMarketSwapFeeAmount: '0'
  } as PoolPriceAndFees
  // uint weightRatio = bdiv(data[3], data[1]);
  const weightRatio = new Decimal(1)
  const tokenOutLiqudity = new Decimal(params.tokenOutLiqudity)
  const tokenInLiquidity = new Decimal(params.tokenInLiquidity)
  const tokenOutAmount = new Decimal(params.tokenOutAmount)
  const opcFee = new Decimal(params.opcFee)
  const lpFee = new Decimal(params.lpSwapFee)
  const publishMarketSwapFee = new Decimal(params.publishMarketSwapFee)
  const consumeMarketSwapFee = new Decimal(params.consumeMarketSwapFee)

  //       uint diff = bsub(data[2], tokenAmountOut);
  const diff = new Decimal(params.tokenOutLiqudity).minus(
    new Decimal(params.tokenOutAmount)
  )
  //       uint y = bdiv(data[2], diff);
  //       uint foo = bpow(y, weightRatio);
  // const y =
  // const foo = new Decimal(params.tokenOutLiqudity).pow
  //       foo = bsub(foo, BONE);
  //       uint totalFee =_swapFee+getOPCFee()+_consumeMarketSwapFee+_swapPublishMarketFee;
  //       tokenAmountIn = bdiv(bmul(data[0], foo), bsub(BONE, totalFee));
  //       _swapfees.oceanFeeAmount =  bsub(tokenAmountIn, bmul(tokenAmountIn, bsub(BONE, getOPCFee())));
  //       _swapfees.publishMarketFeeAmount =  bsub(tokenAmountIn, bmul(tokenAmountIn, bsub(BONE, _swapPublishMarketFee)));
  //       _swapfees.LPFee = bsub(tokenAmountIn, bmul(tokenAmountIn, bsub(BONE, _swapFee)));
  //       _swapfees.consumeMarketFee = bsub(tokenAmountIn, bmul(tokenAmountIn, bsub(BONE, _consumeMarketSwapFee)));
  //       tokenAmountInBalance = bdiv(bmul(data[0], foo), bsub(BONE, _swapFee));
  //       return (tokenAmountIn, tokenAmountInBalance,_swapfees);

  return result
}

export function calcSingleOutGivenPoolIn(
  tokenLiquidity: string,
  poolSupply: string,
  poolShareAmount: string
): string {
  const tokenLiquidityD = new Decimal(tokenLiquidity)
  const poolSupplyD = new Decimal(poolSupply)
  const poolShareAmountD = new Decimal(poolShareAmount)

  const newPoolSupply = poolSupplyD.sub(poolShareAmountD)
  const poolRatio = newPoolSupply.div(poolSupplyD)

  const tokenOutRatio = poolRatio.pow(2)
  const newTokenBalanceOut = tokenLiquidityD.mul(tokenOutRatio)

  const tokensOut = tokenLiquidityD.sub(newTokenBalanceOut)

  return tokensOut.toString()
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
    shares
  )

  return amountBaseToken
}
