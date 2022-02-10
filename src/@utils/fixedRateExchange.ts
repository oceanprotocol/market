import { FixedRateExchange } from '@oceanprotocol/lib'
import Web3 from 'web3'
import { getOceanConfig } from './ocean'
import { getSiteMetadata } from './siteConfig'
import { getDummyWeb3 } from './web3'

/**
 * This is used to calculate the price to buy one datatoken from a pool, that is different from spot price. You need to pass either a web3 object or a chainId. If you pass a chainId a dummy web3 object will be created
 * @param {AccessDetails} accessDetails
 * @param {Web3?} [web3]
 * @param {number?} [chainId]
 * @return {Promise<PriceAndEstimation>}
 */
export async function calculateBuyPrice(
  accessDetails: AccessDetails,
  chainId?: number,
  web3?: Web3
): Promise<string> {
  if (!web3 && !chainId)
    throw new Error("web3 and chainId can't be undefined at the same time!")

  if (!web3) {
    web3 = await getDummyWeb3(chainId)
  }
  const config = getOceanConfig(chainId)
  const pool = new FixedRateExchange(web3, config.fixedRateExchangeAddress)
  const { appConfig } = getSiteMetadata()
  //   const estimatedPrice = await pool.getAmountInExactOut(
  //     accessDetails.addressOrId,
  //     accessDetails.baseToken.address,
  //     accessDetails.datatoken.address,
  //     '1',
  //     appConfig.marketSwapFee
  //   )

  return 'estimatedPrice'
}
