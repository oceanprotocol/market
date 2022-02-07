import { Pool, ZERO_ADDRESS } from '@oceanprotocol/lib'
import Web3 from 'web3'
import { getSiteMetadata } from './siteConfig'
import { getDummyWeb3 } from './web3'

export async function calculateBuyPrice(
  poolAddress: string,
  spotPrice: number,
  tokenIn: string,
  tokenOut: string,
  web3?: Web3,
  chainId?: number
): Promise<PriceAndEstimation> {
  if (web3 && chainId)
    throw new Error("web3 and chainId can't be undefined at the same time!")

  if (!web3) {
    web3 = await getDummyWeb3(chainId)
  }
  console.log('web3', web3)
  const pool = new Pool(web3)
  const { appConfig } = getSiteMetadata()
  const priceAndEstimation = {
    price: '0',
    gasEstimation: 0
  } as PriceAndEstimation

  const estimatedPrice = await pool.getAmountInExactOut(
    poolAddress,
    tokenIn,
    tokenOut,
    '1',
    appConfig.marketFee
  )
  priceAndEstimation.price = estimatedPrice

  const estimation = await pool.estSwapExactAmountOut(
    ZERO_ADDRESS,
    poolAddress,
    {
      marketFeeAddress: appConfig.marketFeeAddress,
      tokenIn,
      tokenOut
    },
    {
      maxAmountIn: (10 * spotPrice).toString(),
      swapMarketFee: appConfig.marketFee,
      tokenAmountOut: '1'
    }
  )
  priceAndEstimation.gasEstimation = estimation

  return priceAndEstimation
}

// export async function buy
