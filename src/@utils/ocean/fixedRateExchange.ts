import { amountToUnits, PriceAndFees, unitsToAmount } from '@oceanprotocol/lib'
import { ethers, Signer } from 'ethers'
import abiFre from '@oceanprotocol/contracts/artifacts/contracts/pools/fixedRate/FixedRateExchange.sol/FixedRateExchange.json'
import { getOceanConfig } from '.'
import { consumeMarketFixedSwapFee } from '../../../app.config'
import { parseEther } from 'ethers/lib/utils.js'

/**
 * calcBaseInGivenDatatokensOut
 * Calculates how many base tokens are needed to get specified amount of datatokens
 */
export async function calcBaseInGivenDatatokensOut(
  fixedRateExchangeAddress: string,
  exchangeId: string,
  datatokenAmount: string,
  provider: Signer,
  consumeMarketFee = '0'
): Promise<PriceAndFees> {
  const fixedRateExchangeContract = new ethers.Contract(
    fixedRateExchangeAddress,
    abiFre.abi,
    provider
  )
  const fixedRateExchange = await fixedRateExchangeContract.getExchange(
    exchangeId
  )
  const outDT = await fixedRateExchange
    .calcBaseInGivenOutDT(
      exchangeId,
      await amountToUnits(
        fixedRateExchange.datatoken,
        datatokenAmount,
        fixedRateExchange.dtDecimals
      ),
      parseEther(consumeMarketFee)
    )
    .call()

  const priceAndFees = {
    baseTokenAmount: await unitsToAmount(
      provider,
      fixedRateExchange.baseToken,
      outDT.baseTokenAmount,
      fixedRateExchange.btDecimals
    ),
    marketFeeAmount: await unitsToAmount(
      provider,
      fixedRateExchange.baseToken,
      outDT.marketFeeAmount,
      fixedRateExchange.btDecimals
    ),
    oceanFeeAmount: await unitsToAmount(
      provider,
      fixedRateExchange.baseToken,
      outDT.oceanFeeAmount,
      fixedRateExchange.btDecimals
    ),
    consumeMarketFeeAmount: await unitsToAmount(
      provider,
      fixedRateExchange.baseToken,
      outDT.consumeMarketFeeAmount,
      fixedRateExchange.btDecimals
    )
  } as PriceAndFees
  return priceAndFees
}

/**
 * This is used to calculate the price to buy one datatoken from a fixed rate exchange. You need to pass either a web3 object or a chainId. If you pass a chainId a dummy web3 object will be created
 */
export async function getFixedBuyPrice(
  accessDetails: AccessDetails,
  chainId: number,
  provider: Signer
): Promise<PriceAndFees> {
  const config = getOceanConfig(chainId)
  const estimatedPrice = await calcBaseInGivenDatatokensOut(
    config.fixedRateExchangeAddress,
    accessDetails.addressOrId,
    '1',
    provider,
    consumeMarketFixedSwapFee
  )
  return estimatedPrice
}
