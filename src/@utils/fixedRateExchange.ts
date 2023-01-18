import { FixedRateExchange, PriceAndFees } from '@oceanprotocol/lib'
import { consumeMarketFixedSwapFee } from '../../app.config'
import { getOceanConfig } from './ocean'

/**
 * This is used to calculate the price to buy one datatoken from a fixed rate exchange. You need to pass either a web3 object or a chainId. If you pass a chainId a dummy web3 object will be created
 * @param {AccessDetails} accessDetails
 * @param {number} chainId
 * @param {Web3?} web3
 * @return {Promise<PriceAndFees>}
 */
export async function getFixedBuyPrice(
  accessDetails: AccessDetails,
  chainId?: number,
  web3Provider?: any
): Promise<PriceAndFees> {
  if (!web3Provider && !chainId)
    throw new Error("web3 and chainId can't be undefined at the same time!")

  const config = getOceanConfig(chainId)

  const fixed = new FixedRateExchange(
    config.fixedRateExchangeAddress,
    web3Provider
  )
  const estimatedPrice = await fixed.calcBaseInGivenDatatokensOut(
    accessDetails.addressOrId,
    '1',
    consumeMarketFixedSwapFee
  )
  return estimatedPrice
}
