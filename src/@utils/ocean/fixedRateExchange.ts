import {
  amountToUnits,
  FixedRateExchange,
  PriceAndFees,
  unitsToAmount
} from '@oceanprotocol/lib'
import { ethers, Signer } from 'ethers'
import abiFre from '@oceanprotocol/contracts/artifacts/contracts/pools/fixedRate/FixedRateExchange.sol/FixedRateExchange.json'
import { getOceanConfig } from '.'
import { consumeMarketFixedSwapFee } from '../../../app.config'

/**
 * This is used to calculate the price to buy one datatoken from a fixed rate exchange. You need to pass either a web3 object or a chainId. If you pass a chainId a dummy web3 object will be created
 */
export async function getFixedBuyPrice(
  accessDetails: AccessDetails,
  chainId: number,
  provider: Signer
): Promise<PriceAndFees> {
  const config = getOceanConfig(chainId)

  const fixed = new FixedRateExchange(config.fixedRateExchangeAddress, provider)
  const estimatedPrice = await fixed.calcBaseInGivenDatatokensOut(
    accessDetails.addressOrId,
    '1',
    consumeMarketFixedSwapFee
  )

  return estimatedPrice
}
