import { Ocean } from '@oceanprotocol/lib'

import { isValidNumber } from './../../../../utils/numberValidations'
import Decimal from 'decimal.js'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

export async function getMaxPercentRemove(
  ocean: Ocean,
  poolAddress: string,
  poolTokens: string
): Promise<string> {
  const amountMaxOcean = await ocean.pool.getOceanMaxRemoveLiquidity(
    poolAddress
  )

  const amountMaxPoolShares =
    await ocean.pool.getPoolSharesRequiredToRemoveOcean(
      poolAddress,
      amountMaxOcean
    )

  let amountMaxPercent =
    isValidNumber(amountMaxPoolShares) && isValidNumber(poolTokens)
      ? new Decimal(amountMaxPoolShares)
          .dividedBy(new Decimal(poolTokens))
          .mul(100)
          .floor()
          .toString()
      : '0'

  if (Number(amountMaxPercent) > 100) {
    amountMaxPercent = '100'
  }

  return amountMaxPercent
}
