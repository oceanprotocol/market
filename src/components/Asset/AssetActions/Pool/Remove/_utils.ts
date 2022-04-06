import { calcMaxExactOut } from '@oceanprotocol/lib'
import Decimal from 'decimal.js'

export async function getMax(poolTokens: string, totalPoolTokens: string) {
  const poolTokensAmount = !poolTokens || poolTokens === '0' ? '1' : poolTokens
  const maxTokensToRemoveFromPool = calcMaxExactOut(totalPoolTokens)
  const poolTokensDecimal = new Decimal(poolTokensAmount)
  const maxTokensToRemoveForUser = maxTokensToRemoveFromPool.greaterThan(
    poolTokensDecimal
  )
    ? poolTokensDecimal
    : maxTokensToRemoveFromPool

  // small hack because if the values are equal the decimal.js result is 99.(9)
  const maxPercent = maxTokensToRemoveForUser.equals(poolTokensDecimal)
    ? new Decimal(100)
    : new Decimal(100).mul(maxTokensToRemoveForUser).div(poolTokensDecimal)

  console.log(
    'percent',
    maxPercent.toString(),
    maxTokensToRemoveForUser.toString(),
    poolTokensDecimal.toString()
  )

  return maxPercent.toDecimalPlaces(0, Decimal.ROUND_DOWN).toString()
}
