import { FixedRateExchange, PriceAndFees } from '@oceanprotocol/lib'
import { consumeMarketFixedSwapFee } from '../../app.config'
import Web3 from 'web3'
import { getOceanConfig } from './ocean'
import { getDummyWeb3 } from './web3'

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
  web3?: Web3
): Promise<PriceAndFees> {
  if (!web3 && !chainId)
    throw new Error("web3 and chainId can't be undefined at the same time!")

  if (!web3) {
    web3 = await getDummyWeb3(chainId)
  }

  const config = getOceanConfig(chainId)

  const fixed = new FixedRateExchange(config.fixedRateExchangeAddress, web3)
  const estimatedPrice = await fixed.calcBaseInGivenDatatokensOut(
    accessDetails.addressOrId,
    '1',
    consumeMarketFixedSwapFee
  )
  return estimatedPrice
}
